using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Diagnostics;


namespace LogAnalyzer
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class LogGraph : Window
    {
        private List<string> dates2;
        private string msg2;
        private string first;
        private string last;
        bool graphAll = false;
        public LogGraph(List<string> dates, string msg)
        {
            InitializeComponent();
            dates2 = dates;
            msg2 = msg;
        }

        public LogGraph(List<List<string>> dates, string msg, string[] firstLast)
        {
            InitializeComponent();
            //dates2 = dates;
            msg2 = msg;
            first = firstLast[0];
            last = firstLast[1];
            graphAll = true;
        }

        // The data.
        private static Brush[] DataBrushes = { Brushes.Red };//, Brushes.Green, Brushes.Blue };
        private PointCollection[] DataPoints = new PointCollection[DataBrushes.Length];
        private static string[] list1 = new string[] { "11:15", "11:15", "11:15" };
        private static string[] list2 = new string[] { "11:16", "11:16", "11:16", "11:16", "11:16" };
        private static string[] list3 = new string[] { "11:18" };
        private static string[] list4 = new string[] { "11:20", "11:20", "11:20", "11:20", "11:20", "11:20", "11:20" };
        private static string[] list5 = new string[] { "11:21", "11:21", "11:21" };
        private List<string[]> dates = new List<string[]>() { list1, list2, list3, list4, list5 };
        //private List<string> dates2 = new List<string>() { "2016-05-17 11:50:15,123", "2016-05-17 11:50:15,221", "2016-05-17 11:50:15,353", "2016-05-17 11:50:16,234", "2016-05-17 11:50:16,873", "2016-05-17 11:50:16,892", "2016-05-17 11:50:16,901", "2016-05-17 11:50:16,903", "2016-05-17 11:50:18,935", "2016-05-17 11:50:20,234", "2016-05-17 11:50:20,567", "2016-05-17 11:50:20,672", "2016-05-17 11:50:20,801", "2016-05-17 11:50:20,831", "2016-05-17 11:50:20,873", "2016-05-17 11:50:20,943", "2016-05-17 11:50:21,032", "2016-05-17 11:50:21,482", "2016-05-17 11:50:21,234", "2016-05-17 11:50:21,827", "2016-05-17 11:50:18,835", "2016-05-17 11:50:18,535" };
        private Dictionary<double, List<string>> datePair = new Dictionary<double, List<string>>();

        // To mark a clicked point.
        private Ellipse DataEllipse = null;
        private Label DataLabel = null;

        // Draw a simple graph.
        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            dates2.Sort();
            //if (graphAll)
                makeGraph(8);
            /*else
                makeGraph2(8);*/
        }

        private string getDate(int i)
        {
            return dates[i][0];
        }

        // Prepare values for perform transformations.
        private Matrix WtoDMatrix, DtoWMatrix;
        private void PrepareTransformations(
            double wxmin, double wxmax, double wymin, double wymax,
            double dxmin, double dxmax, double dymin, double dymax)
        {
            // Make WtoD.
            WtoDMatrix = Matrix.Identity;
            WtoDMatrix.Translate(-wxmin, -wymin);

            double xscale = (dxmax - dxmin) / (wxmax - wxmin);
            double yscale = (dymax - dymin) / (wymax - wymin);
            WtoDMatrix.Scale(xscale, yscale);

            WtoDMatrix.Translate(dxmin, dymin);

            // Make DtoW.
            DtoWMatrix = WtoDMatrix;
            DtoWMatrix.Invert();
        }

        // Transform a point from world to device coordinates.
        private Point WtoD(Point point)
        {
            return WtoDMatrix.Transform(point);
        }

        // Transform a point from device to world coordinates.
        private Point DtoW(Point point)
        {
            return DtoWMatrix.Transform(point);
        }

        // Position a label at the indicated point.
        private void DrawText(Canvas can, string text,
            Point location, double angle, double font_size,
            HorizontalAlignment halign, VerticalAlignment valign)
        {
            // Make the label.
            Label label = new Label();
            label.Content = text;
            label.FontSize = font_size;
            can.Children.Add(label);

            // Rotate if desired.
            if (angle != 0) label.LayoutTransform = new RotateTransform(angle);

            // Position the label.
            label.Measure(new Size(double.MaxValue, double.MaxValue));

            double x = location.X;
            if (halign == HorizontalAlignment.Center)
                x -= label.DesiredSize.Width / 2;
            else if (halign == HorizontalAlignment.Right)
                x -= label.DesiredSize.Width;
            Canvas.SetLeft(label, x);

            double y = location.Y;
            if (valign == VerticalAlignment.Center)
                y -= label.DesiredSize.Height / 2;
            else if (valign == VerticalAlignment.Bottom)
                y -= label.DesiredSize.Height;
            Canvas.SetTop(label, y);
        }

        // See if the mouse is over a data point.
        private void canGraph_MouseUp(object sender, MouseButtonEventArgs e)
        {
            // Find the data point at the mouse's location.
            Point mouse_location = e.GetPosition(canGraph);
            int data_set, point_number;
            FindDataPoint(mouse_location, out data_set, out point_number);
            if (data_set < 0) return;
            Point data_point = DataPoints[data_set][point_number];

            // Make the data ellipse if we haven't already.
            if (DataEllipse == null)
            {
                DataEllipse = new Ellipse();
                DataEllipse.Fill = null;
                DataEllipse.StrokeThickness = 1;
                DataEllipse.Width = 7;
                DataEllipse.Height = 7;
                canGraph.Children.Add(DataEllipse);
            }

            // Color and position the ellipse.
            DataEllipse.Stroke = DataBrushes[data_set];
            Canvas.SetLeft(DataEllipse, data_point.X - 3);
            Canvas.SetTop(DataEllipse, data_point.Y - 3);

            // Make the data label if we haven't already.
            if (DataLabel == null)
            {
                DataLabel = new Label();
                DataLabel.FontSize = 12;
                canGraph.Children.Add(DataLabel);
            }

            // Convert the data values back into world coordinates.
            Point world_point = DtoW(data_point);

            // Set the data label's text and position it.
            //Debug.Print(world_point.X + "");
            /*for(int i = 0; i < datePair.Count; i++)
            {
                Debug.Print(datePair[i][0]);
            }*/
            double temp = world_point.X;
            DataLabel.Content = "(" +
                datePair[Convert.ToInt32(temp)][0] + ", " +
                world_point.Y.ToString("0.0") + ")";
            DataLabel.Measure(new Size(double.MaxValue, double.MaxValue));
            if (Convert.ToInt32(temp) < datePair.Count / 2)
                Canvas.SetLeft(DataLabel, data_point.X);
            else
            {
                Canvas.SetLeft(DataLabel, data_point.X - 150);
                //Debug.Print(canGraph.Width+" "+data_point.X);
            }
            Canvas.SetTop(DataLabel, data_point.Y - DataLabel.DesiredSize.Height);
        }

        // Change the mouse cursor appropriately.
        private void canGraph_MouseMove(object sender, MouseEventArgs e)
        {
            // Find the data point at the mouse's location.
            Point mouse_location = e.GetPosition(canGraph);
            int data_set, point_number;
            FindDataPoint(mouse_location, out data_set, out point_number);

            // Display the appropriate cursor.
            if (data_set < 0)
                canGraph.Cursor = null;
            else
                canGraph.Cursor = Cursors.UpArrow;
        }

        private void Per_Minute_Checked(object sender, RoutedEventArgs e)
        {
            canGraph.Children.Clear();
            datePair.Clear();
            makeGraph(5);
        }


        // Find the data point at this device coordinate location.
        // Return data_set = -1 if there is no point at this location.
        private void FindDataPoint(Point location, out int data_set, out int point_number)
        {
            // Check each data set.
            for (data_set = 0; data_set < DataPoints.Length; data_set++)
            {
                //accounts for possible null reference
                if (DataPoints[0] != null)
                {
                    // Check this data set.
                    for (point_number = 0;
                        point_number < DataPoints[data_set].Count;
                        point_number++)
                    {
                        // See how far the location is from the data point.
                        Point data_point = DataPoints[data_set][point_number];
                        Vector vector = location - data_point;
                        double dist = vector.Length;
                        if (dist < 3) return;
                    }
                }
            }

            // We didn't find a point at this location.
            data_set = -1;
            point_number = -1;
        }


        private void Per_Minute_Unchecked(object sender, RoutedEventArgs e)
        {
            canGraph.Children.Clear();
            datePair.Clear();
            makeGraph(8);
        }

        private void makeGraph(int dateLength)
        {
            canGraph.Children.Clear();
            datePair.Clear();
            //dates2.Sort();
            string check = "";
            //Debug.Print(dates2[0].Substring(11, 5));
            int numDates = 0;
            for (int i = 0; i < dates2.Count; i++)
            {
                string sub = dates2[i].Substring(11, dateLength);
                //Debug.Print(dates2[i]);
                if (!sub.Equals(check))
                {
                    //Debug.Print(tick + "");
                    /*for (int j = 0; j < newList.Count; j++)
                    {
                        Debug.Print(newList[j]);
                    }*/
                    //List<string> tempList = new List<string>();
                    /*for (int k = 0; k < newList.Count; k++)
                    {
                        tempList.Add(newList[k]);
                    }*/
                    numDates++;
                    //datePair.Add(tick, tempList);
                    //Debug.Print(datePair[tick].Count + "");
                    //newList.Clear();
                    //newList = new List<string>();
                    //newList.Add(dates2[i]);
                    //tick += xstep;
                }
                /*else
                {
                    newList.Add(dates2[i]);
                    //Debug.Print(dates2[i]);
                }*/
                check = dates2[i].Substring(11, dateLength);
            }
            //datePair.Add(tick, newList);
            //numDates++;
            //Debug.Print(dates2.Count + "");
            double wxmin = -1;
            double wxmax = numDates;
            int xstep = 1;
            int tracker = Int32.MaxValue;
            int track = 0;
            while (true)
            {
                Debug.Print(tracker + "");
                if (wxmax > tracker)
                {
                    wxmin -= 2;
                    tracker += 50;
                }
                else if ((wxmax >= 50) && (track == 0))
                {
                    wxmin = -2;
                    tracker = 50;
                }
                else
                    break;
                track++;
            }

            const double dmargin = 10;
            double dxmin = dmargin;
            double dxmax = canGraph.Width - dmargin;
            double dymin = dmargin;
            double dymax = canGraph.Height - dmargin;

            int rep = 0;
            check = dates2[0].Substring(11, dateLength);
            int tick = 0;
            List<string> newList = new List<string>();

            for (int i = 0; i < dates2.Count; i++)
            {
                string sub = dates2[i].Substring(11, dateLength);
                if (!sub.Equals(check))
                {
                    //Debug.Print(tick + "");
                    /*for (int j = 0; j < newList.Count; j++)
                    {
                        Debug.Print(newList[j]);
                    }*/
                    List<string> tempList = new List<string>();
                    for (int k = 0; k < newList.Count; k++)
                    {
                        tempList.Add(newList[k]);
                    }
                    numDates++;
                    datePair.Add(tick, tempList);
                    //Debug.Print(datePair[tick].Count + "");
                    newList.Clear();
                    //newList = new List<string>();
                    newList.Add(dates2[i]);
                    tick += xstep;
                }
                else
                {
                    newList.Add(dates2[i]);
                    //Debug.Print(dates2[i]);
                }
                check = dates2[i].Substring(11, dateLength);
            }
            datePair.Add(tick, newList);
            numDates++;
            Debug.Print(datePair.Count + "");
            int largest = 0;
            for (int i = 0; i < datePair.Count; i++)
            {
                if (datePair[i].Count > largest)
                    largest = datePair[i].Count;
            }
            int wymax = largest;
            double ystep;
            if (wymax == 0)
                ystep = 0;
            else if (wymax <= 20)
                ystep = 1;
            else
            {
                double tempStep = wymax / 20.0;
                int yCountS = 1;
                int yCountL = 5;
                bool switcher = true;
                while (true)
                {
                    if (tempStep < yCountL)
                    {
                        if (Math.Abs(tempStep - yCountS) < Math.Abs(tempStep - yCountL))
                            ystep = yCountS;
                        else
                            ystep = yCountL;
                        break;
                    }

                    if (switcher)
                    {
                        yCountS *= 5;
                        yCountL *= 2;
                        switcher = false;
                    }
                    else
                    {
                        yCountS *= 2;
                        yCountL *= 5;
                        switcher = true;
                    }

                }
            }
            double wymin = -ystep;
            //Debug.Print(datePair[tick].Count + "");
            /*for(int i = 0; i < datePair.Count*5; i+=5)
            {
                for(int j = 0; j < datePair[i].Count; j++)
                    Debug.Print(datePair[i][j] + "");
            }*/
            // Prepare the transformation matrices.
            PrepareTransformations(
                wxmin, wxmax, wymin, wymax,
                dxmin, dxmax, dymax, dymin);
            // Make a title
            Point title_location = WtoD(new Point(numDates / 4, largest));
            DrawText(canGraph, msg2,
                title_location, 0, 20,
                HorizontalAlignment.Center,
                VerticalAlignment.Top);
            Point x_location = WtoD(new Point(numDates / 4, -0.3));
            DrawText(canGraph, "Date/Time",
                x_location, 0, 20,
                HorizontalAlignment.Center,
                VerticalAlignment.Top);
            Point y_location = WtoD(new Point((wxmin), largest / 2));
            DrawText(canGraph, "Number of Hits",
                y_location, -90, 20,
                HorizontalAlignment.Center,
                VerticalAlignment.Top);

            // Get the tic mark lengths.
            Point p0 = DtoW(new Point(0, 0));
            Point p1 = DtoW(new Point(5, 5));
            double xtic = p1.X - p0.X;
            double ytic = p1.Y - p0.Y;

            // Make the X axis.
            GeometryGroup xaxis_geom = new GeometryGroup();
            p0 = new Point(wxmin, 0);
            p1 = new Point(wxmax, 0);
            xaxis_geom.Children.Add(new LineGeometry(WtoD(p0), WtoD(p1)));
            int count = 0;
            for (double x = 0; x <= wxmax - xstep; x += xstep)
            {
                //string temp = dates[count][0];
                // Add the tic mark.
                Point tic0 = WtoD(new Point(x, -ytic));
                Point tic1 = WtoD(new Point(x, ytic));
                xaxis_geom.Children.Add(new LineGeometry(tic0, tic1));
                // Label the tic mark's X coordinate.
                if ((count < datePair.Count) && (count == 0 || count == datePair.Count - 1))
                {
                    string temp = datePair[x][0];
                    DrawText(canGraph, temp + x.ToString(),
                    new Point(tic0.X, tic0.Y + 5), 0, 12,
                    HorizontalAlignment.Center,
                    VerticalAlignment.Top);
                }
                else
                {
                    DrawText(canGraph, "",
                    new Point(tic0.X, tic0.Y + 5), 0, 12,
                    HorizontalAlignment.Center,
                    VerticalAlignment.Top);
                }
                count++;
                /*if (count >= dates.Count)
                    break;*/
            }

            Path xaxis_path = new Path();
            xaxis_path.StrokeThickness = 1;
            xaxis_path.Stroke = Brushes.Black;
            xaxis_path.Data = xaxis_geom;

            canGraph.Children.Add(xaxis_path);
            int maxCount = 0;
            for (int i = 0; i < dates.Count; i++)
            {
                if (maxCount < dates[i].Length)
                    maxCount = dates[i].Length;
            }

            // Make the Y axis.
            GeometryGroup yaxis_geom = new GeometryGroup();
            p0 = new Point(0, wymin);
            p1 = new Point(0, wymax);
            xaxis_geom.Children.Add(new LineGeometry(WtoD(p0), WtoD(p1)));
            int sum = 0;
            for (double y = ystep; y <= wymax - ystep; y += ystep)
            {
                //int x = dates[i].length;
                // Add the tic mark.
                Point tic0 = WtoD(new Point(-xtic, y));
                Point tic1 = WtoD(new Point(xtic, y));
                xaxis_geom.Children.Add(new LineGeometry(tic0, tic1));

                // Label the tic mark's Y coordinate.
                DrawText(canGraph, y.ToString(),
                    new Point(tic0.X - 10, tic0.Y), -90, 12,
                    HorizontalAlignment.Center,
                    VerticalAlignment.Center);
            }

            Path yaxis_path = new Path();
            yaxis_path.StrokeThickness = 1;
            yaxis_path.Stroke = Brushes.Black;
            yaxis_path.Data = yaxis_geom;

            canGraph.Children.Add(yaxis_path);
            int count2 = 0;
            // Make some data sets.
            Random rand = new Random();
            int sum1 = 0;
            for (int data_set = 0; data_set < DataBrushes.Length; data_set++)
            {
                //double last_y = rand.Next(0, 10);

                DataPoints[data_set] = new PointCollection();
                if (data_set == 0)
                {
                    for (double x = 0; x <= wxmax - xstep; x += xstep)
                    {
                        double last_y = rand.Next(0, 10);
                        //last_y += rand.Next(-10, 10) / 10.0;
                        //if (last_y < 0) last_y = 0;
                        //if (last_y > 10) last_y = 10;
                        sum1 += datePair[x].Count;
                        //Debug.Print(sum1 + "");
                        Point p = new Point(x, datePair[x].Count);
                        DataPoints[data_set].Add(WtoD(p));
                        count2++;
                        if (count2 >= datePair.Count)
                            break;
                    }
                }
                else
                {
                    for (double x = 0; x <= wxmax - xstep; x += xstep)
                    {
                        double last_y = rand.Next(0, largest);
                        //last_y += rand.Next(-10, 10) / 10.0;
                        //if (last_y < 0) last_y = 0;
                        //if (last_y > 10) last_y = 10;
                        //sum1 += datePair[x].Count;
                        //Debug.Print(sum1 + "");
                        Point p = new Point(x, last_y);
                        DataPoints[data_set].Add(WtoD(p));
                        //count2++;
                        //if (count2 >= datePair.Count)
                            //break;
                    }
                }

                Polyline polyline = new Polyline();
                polyline.StrokeThickness = 1;
                polyline.Stroke = DataBrushes[data_set];
                polyline.Points = DataPoints[data_set];

                canGraph.Children.Add(polyline);
            }
        }
    }
}
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
using System.Windows.Forms;
using System.IO;
using System.ComponentModel;
using System.Xml;
using System.Diagnostics;
using System.Threading;
using System.Windows.Threading;
using Newtonsoft.Json;
using System.Collections.Concurrent;
using System.Text.RegularExpressions;


namespace LogAnalyzer
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        public const string LINE_MISMATCH = "Mismatched Lines";
        private List<RunMessageList> allMessageLists;
        private List<string[]> runs;
        private Tuple<Dictionary<string, List<string>>, Dictionary<string, List<string>>> regexExpressions;
        private List<Dictionary<string, List<string>>> messagesList = null;
        private string folderSelectedPath;
        private static bool readyToSearch = false;
        private static List<string[]> firstLastDates;
        private static bool doubleFilter;
        private string buildNo;
        private static Dictionary<string, string> classAndNumDict;

        public MainWindow()
        {
            InitializeComponent();
            logTab.Visibility = Visibility.Hidden;
        }

        private bool LogFilter(object item)
        {
            if (String.IsNullOrEmpty(SearchBox.Text))
                return true;
            else
                return ((item as MessageGroup).message.IndexOf(SearchBox.Text, StringComparison.OrdinalIgnoreCase) >= 0);
        }

        private bool ZeroFilter(object item)
        {
            return ((item as MessageGroup).count != 0 && 
                (item as MessageGroup).message.IndexOf(SearchBox.Text, StringComparison.OrdinalIgnoreCase) >= 0);
        }

        private void button_Click(object sender, RoutedEventArgs e)
        {
            // Create OpenFileDialog 
            FolderBrowserDialog fbd = new FolderBrowserDialog();

            var result = fbd.ShowDialog();
            if (result == System.Windows.Forms.DialogResult.OK)
            {
                folderSelectedPath = fbd.SelectedPath;
                folderNameBox.Text = folderSelectedPath;
                analyzeButton.IsEnabled = true;
            }
        }

        private void tabControl_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (logTab.Items.Count > 0)
                rxList.ItemsSource = allMessageLists[logTab.SelectedIndex].messageGroups;

            if (logTab.SelectedIndex != -1)
            {
                string[] firstLastDate = allMessageLists[logTab.SelectedIndex].firstLastDates;  //Throws ArgumentOutOfRangeException when doing fresh run after first run (SelectedIndex = -1)
                runLabel.Content = "Run Time: " + firstLastDate[0] + " to " + firstLastDate[1];
                runLengthLabel.Content = "Run Lasted: " + LogAnalyzerLogic.getTimeStringInRun(firstLastDate);
            }

            if (doubleFilter)
            {
                readyToSearch = true;
                CollectionView view = (CollectionView)CollectionViewSource.GetDefaultView(rxList.ItemsSource);
                view.Filter = ZeroFilter;
            }
            else
            {
                readyToSearch = true;
                CollectionView view = (CollectionView)CollectionViewSource.GetDefaultView(rxList.ItemsSource);
                view.Filter = LogFilter;
            }

        }

        private void fileButton_Click(object sender, RoutedEventArgs e)
        {

            // Create OpenFileDialog 
            Microsoft.Win32.OpenFileDialog dlg = new Microsoft.Win32.OpenFileDialog();

            Nullable<bool> result = dlg.ShowDialog();

            // Get the selected file name and display in a TextBox 
            if (result == true)
            {
                //show file name
                string filename = dlg.FileName;
                classAndNumDict = LogAnalyzerLogic.getClassAndNum(filename);
                regexExpressions = LogAnalyzerLogic.getRegEx(filename);
                fileNameBox.Text = filename;
                buildNo = "Build No. " + LogAnalyzerLogic.getBuildNo(filename);
                buildLabel.Content = buildNo;
                folderButton.IsEnabled = true;
            }
        }

        private void rxList_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            System.Windows.Controls.ListViewItem item = sender as System.Windows.Controls.ListViewItem;
            if (item != null)
            {
                MessageGroup obj = (MessageGroup)item.Content;

                List<string> dates = obj.dateList;
                string msg = obj.message;


                if (!msg.Equals(LINE_MISMATCH))
                {
                    LogGraph lg = new LogGraph(dates, msg);
                    lg.Show();
                    lg.Activate();

                    lg.Focus();
                    lg.Topmost = true;
                }
                else
                {
                    DateListWindow dlw = new DateListWindow(dates);
                    dlw.Show();
                    dlw.Activate();

                    dlw.Focus();
                    dlw.Topmost = true;
                }

            }
        }


        private void updateRxList(int index)
        {
            List<MessageGroup> mg = new List<MessageGroup>();
            Dictionary<string, List<string>> dict = messagesList[index];
            Dictionary<string, bool> checker = new Dictionary<string, bool>();

            foreach (KeyValuePair<string, List<string>> kvp in regexExpressions.Item2)
            {
                double seconds = LogAnalyzerLogic.getSecondsInRun(allMessageLists[index].firstLastDates);
                double minutes = seconds / 60;
                //prints out the date and corresponding message for now; change later
                for (int i = 0; i < kvp.Value.Count; i++)
                {
                    int avgCountSec = (int)((dict[kvp.Value[i]].Count) / seconds);
                    int avgCountMin = (int)((dict[kvp.Value[i]].Count) / minutes);
                    if (!checker.ContainsKey(regexExpressions.Item2[kvp.Key][i]))
                    {
                        mg.Add(new MessageGroup(avgCountSec, dict[kvp.Value[i]].Count,
                            regexExpressions.Item2[kvp.Key][i], kvp.Value[i], avgCountMin, dict[kvp.Value[i]]));
                        checker.Add(regexExpressions.Item2[kvp.Key][i], true);
                    }
                }
            }
            allMessageLists[index].messageGroups = mg;
            rxList.ItemsSource = allMessageLists[logTab.SelectedIndex].messageGroups;


            if (doubleFilter)
            {
                readyToSearch = true;
                CollectionView view = (CollectionView)CollectionViewSource.GetDefaultView(rxList.ItemsSource);
                view.Filter = ZeroFilter;
            }
            else
            {
                readyToSearch = true;
                CollectionView view = (CollectionView)CollectionViewSource.GetDefaultView(rxList.ItemsSource);
                view.Filter = LogFilter;
            }

        }

        private async void analyzeAllLogs()
        {
            for (int i = 0; i < runs.Count; i++)
            {
                messagesList.Add(null); // add null list to fill index when analyzeRuns is called

                //updates UI with dispatcher (setting tabs + updating progress)
                TabItem myTabPage = new TabItem();
                myTabPage.Header = allMessageLists[i].runName;
                logTab.Items.Add(myTabPage);
                if (runs.Count == 1)
                    logTab.SelectedIndex = 0;
                runsProcessedText.Text = (i) + "/" + runs.Count + "  Runs Processed";
                filesProcessedText.Text = 0 + "/" + runs[i].Length + "  Files of Run Processed";

                await analyzeLogs(runs[i], i);

                //updates UI with dispatcher (updating runs processed count)

                runsProcessedText.Text = (i + 1) + "/" + runs.Count + "  Runs Processed";
            }

            //allow buttons to be clickable again after everything is done

            analyzeButton.IsEnabled = true;
            folderButton.IsEnabled = true;
            fileButton.IsEnabled = true;
            graphAllButton.IsEnabled = true;
        }

        // analyzes the log files, returning a Dictionary of string and List of strings
        private async Task analyzeLogs(string[] runFileNames, int messageListIndex)
        {
            ConcurrentDictionary<string, List<string>> messages = new ConcurrentDictionary<string, List<string>>();
            //add all regexexpressions as keys so no conflicts later, empty string list as value

            Dictionary<string, List<string>> fullLinesDict = regexExpressions.Item2;
            foreach (KeyValuePair<string, List<string>> kvp in fullLinesDict)
            {
                for (int i = 0; i < kvp.Value.Count; i++)
                {
                    if (!messages.ContainsKey(kvp.Value[i]))
                        messages.GetOrAdd(kvp.Value[i], new List<string>());
                }
            }
            //go through all files of run
            int threadsForFiles = Environment.ProcessorCount - 1; // NUMBER OF FILES TO CHECK AT THE SAME TIME (cores - 1), - 1 for main thread

            for (int i = 0; i < runFileNames.Length; i += threadsForFiles)
            {
                if (i + threadsForFiles > runFileNames.Length)
                {
                    threadsForFiles = runFileNames.Length - i;
                }
                Task[] tasks = new Task[threadsForFiles];
                for (int j = 0; j < threadsForFiles; j++)
                {
                    int indx = i + j;
                    tasks[j] = Task.Run(() => LogAnalyzerLogic.parseFile(runFileNames[indx], regexExpressions, messages, classAndNumDict));
                }
                await Task.WhenAll(tasks);
                messagesList[messageListIndex] = messages.ToDictionary(kvp => kvp.Key,
                                                          kvp => kvp.Value); // set messages list after each file parse

                //change UI

                filesProcessedText.Text = (i + threadsForFiles) + "/" + runs[messageListIndex].Length + "  Files of Run Processed";
                updateRxList(messageListIndex);
            }

            //  return messages;
        }


        private void analyzeButton_Click(object sender, RoutedEventArgs e)
        {
            string[] fileNames = Directory.GetFiles(folderSelectedPath);
            string[] fileNamesOnlyLogs = LogAnalyzerLogic.removeNonLogFiles(fileNames).ToArray();
            runs = LogAnalyzerLogic.runSplitter(fileNamesOnlyLogs);

            logTab.Visibility = Visibility.Visible;
            messagesList = null;
            logTab.Items.Clear(); // clear all tabs if usre pressed analyze again on new things

            logTab.SelectedIndex = 0;

            messagesList = new List<Dictionary<string, List<string>>>();

            List<string[]> firstLastDate = LogAnalyzerLogic.getFirstLastDates(runs);

            runLabel.Content = "Run Time: " + firstLastDate[0][0] + " to " + firstLastDate[0][1];
            runLengthLabel.Content = "Run Lasted: " + LogAnalyzerLogic.getTimeStringInRun(firstLastDate[0]);

            // CREATE ALL MESSAGE LIST AND INITIALIZE WITH BLANK LISTS
            allMessageLists = new List<RunMessageList>();
            for (int i = 0; i < runs.Count; i++)
            {
                allMessageLists.Add(new RunMessageList(new List<MessageGroup>(), LogAnalyzerLogic.getRunName(runs[i][0]), firstLastDate[i], buildNo));
            }

            runsProcessedText.Text = 0 + "/" + runs.Count + "  Runs Processed";
            filesProcessedText.Text = 0 + "/" + runs[0].Length + "  Files of Run Processed";

            // disable all buttons while analyzing
            analyzeButton.IsEnabled = false;
            folderButton.IsEnabled = false;
            fileButton.IsEnabled = false;
            graphAllButton.IsEnabled = false;

            analyzeAllLogs();

        }

        private void SearchBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (readyToSearch)
            {
                CollectionViewSource.GetDefaultView(rxList.ItemsSource).Refresh();
            }
        }

        private void SaveFile_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                string json = JsonConvert.SerializeObject(allMessageLists);   //throws outofmemory exception when saving big files
                SaveFileDialog saveFileDialog1 = new SaveFileDialog();

                saveFileDialog1.Filter = "JSON files (*.JSON)|*.JSON";
                saveFileDialog1.FilterIndex = 2;
                saveFileDialog1.RestoreDirectory = true;

                if (saveFileDialog1.ShowDialog() == System.Windows.Forms.DialogResult.OK)
                {
                    System.IO.File.WriteAllText(saveFileDialog1.FileName, json);
                }
            }
            catch (OutOfMemoryException ex)
            {
                System.Windows.MessageBox.Show(ex.GetType().FullName + "!\n\nFile too large to serialize.");
            }


        }

        private void OpenFile_Click(object sender, RoutedEventArgs e)
        {
            // Create OpenFileDialog 
            Microsoft.Win32.OpenFileDialog dlg = new Microsoft.Win32.OpenFileDialog();
            dlg.Filter = "JSON files (*.JSON)|*.JSON";
            Nullable<bool> result = dlg.ShowDialog();

            // Get the selected file name and display in a TextBox 
            if (result == true)
            {
                //show file name
                string filename = dlg.FileName;
                string json = File.ReadAllText(filename);
                List<RunMessageList> amlNew = JsonConvert.DeserializeObject<List<RunMessageList>>(json);
                allMessageLists = amlNew;

                buildLabel.Content = amlNew[0].buildNum;

                logTab.Visibility = Visibility.Visible;
                logTab.Items.Clear(); // clear all tabs if usre pressed analyze again on new things
                // recreate tabs
                for (int i = 0; i < allMessageLists.Count; i++)
                {
                    TabItem myTabPage = new TabItem();
                    myTabPage.Header = allMessageLists[i].runName;
                    logTab.Items.Add(myTabPage);
                    if (allMessageLists.Count == 1)
                        logTab.SelectedIndex = 0;
                }

                // set list view
                rxList.ItemsSource = allMessageLists[logTab.SelectedIndex].messageGroups;

                runsProcessedText.Text = "";
                filesProcessedText.Text = "";
            }
        }

        private void zfilter_Checked(object sender, RoutedEventArgs e)
        {
            doubleFilter = true;
            if (readyToSearch)
            {
                CollectionView view = (CollectionView)CollectionViewSource.GetDefaultView(rxList.ItemsSource);
                view.Filter = ZeroFilter;
            }
        }

        private void zfilter_Unchecked(object sender, RoutedEventArgs e)
        {
            doubleFilter = false;
            if (readyToSearch)
            {
                CollectionView view = (CollectionView)CollectionViewSource.GetDefaultView(rxList.ItemsSource);
                view.Filter = LogFilter;
            }
        }

        private void graphAllButton_Click(object sender, RoutedEventArgs e)
        {
            RunMessageList allMessageList = allMessageLists[logTab.SelectedIndex];
            string[] firstLast = allMessageList.firstLastDates;
            List<List<string>> listofdates = new List<List<string>>();
            for (int i = 0; i < allMessageList.messageGroups.Count; i++)
            {
                listofdates.Add(allMessageList.messageGroups[i].dateList);
            }

            LogGraph lg = new LogGraph(listofdates, allMessageList.runName, firstLast);
            lg.Show();
            lg.Activate();

            lg.Focus();
            lg.Topmost = true;

        }
    }

    // object class for populating rxList
    public class MessageGroup
    {
        public string messageType { get; set; }
        public int count { get; set; }
        public string message { get; set; }
        public double avgCountPerSec { get; set; }
        public double avgCountPerMin { get; set; }
        public List<string> dateList { get; set; }

        public MessageGroup(double avgCountPerSec, int count, string message, string messageType, double avgCountPerMin, List<string> dateList)
        {
            this.messageType = messageType;
            this.count = count;
            this.message = message;
            this.avgCountPerSec = avgCountPerSec;
            this.avgCountPerMin = avgCountPerMin;
            this.dateList = dateList;
        }
    }

    public class RunMessageList
    {
        public List<MessageGroup> messageGroups { get; set; }
        public string runName { get; set; }

        public string[] firstLastDates { get; set; }

        public string buildNum { get; set; }
        public RunMessageList(List<MessageGroup> mg, string runName, string[] firstLastDates, string buildNum)
        {
            this.messageGroups = mg;
            this.runName = runName;
            this.firstLastDates = firstLastDates;
            this.buildNum = buildNum;
        }
    }



}

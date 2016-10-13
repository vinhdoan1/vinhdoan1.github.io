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
using System.Windows.Shapes;

namespace LogAnalyzer
{
    /// <summary>
    /// Interaction logic for DateListWindow.xaml
    /// </summary>
    public partial class DateListWindow : Window
    {
        List<string> dates;

        public DateListWindow(List<string> msgdates)
        {
            InitializeComponent();
            dates = msgdates;

            for (int i = 0; i < dates.Count; i++)
                listBox.Items.Add(dates[i]);
        }
    }
}

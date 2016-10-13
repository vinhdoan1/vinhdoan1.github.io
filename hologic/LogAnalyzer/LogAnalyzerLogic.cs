using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Windows.Forms;
using MessageBox = System.Windows.MessageBox;
using System.Collections.Concurrent;

namespace LogAnalyzer
{
    class LogAnalyzerLogic
    {
        public static ConcurrentQueue<Tuple<string, string>> cache = null;

        // returns true is success, false if failure
        public static bool parseFile(string filename, Tuple<Dictionary<string, List<string>>, Dictionary<string, List<string>>> regexExpressions, ConcurrentDictionary<string, List<string>> messages, Dictionary<string, string> can)
        {
            string input;

            if (System.IO.File.Exists(filename) == true)
            {
                System.IO.StreamReader objectReader;
                objectReader = new System.IO.StreamReader(filename);
                string pantherRgx = @"\|PantherUI\|";
                input = objectReader.ReadLine();
                Dictionary<string, List<string>> regexExpression = regexExpressions.Item1;
                Dictionary<string, List<string>> fullLines = regexExpressions.Item2;

                while (input != null)
                {
                    // check whether |PantherUI|
                    if (Regex.IsMatch(input, pantherRgx))
                    {
                        string[] pipes = input.Split('|');
                        string msg = pipes[6];
                        string classname = pipes[2];
                        string date = pipes[0];
                        string type = pipes[5];
                        Tuple<string, string> match = null;
                        int idx = 0;

                        if (!classname.Equals("ExceptionHelper") && !classname.Equals("Logger"))
                        {
                            string lineNum = msg.Substring(msg.IndexOf('[') + 1, msg.IndexOf(']') - msg.IndexOf('[') - 1);
                            string key = classname + "|" + lineNum;
                            if (can.ContainsKey(key))
                                messages[can[key]].Add(date);
                            else
                            {
                                messages[MainWindow.LINE_MISMATCH].Add(input);

                            }
                        }
                    }
                    input = objectReader.ReadLine();
                }
                objectReader.Close();
                return true;
            }
            else
                return false;

        }

        public static Tuple<Dictionary<string, List<string>>, Dictionary<string, List<string>>> getRegEx(string filename)
        {
            string line;
            string type;
            Tuple<Dictionary<string, List<string>>, Dictionary<string, List<string>>> RXlist =
                new Tuple<Dictionary<string, List<string>>, Dictionary<string, List<string>>>
                    (new Dictionary<string, List<string>>(), new Dictionary<string, List<string>>());
            RXlist.Item1.Add("Error", new List<string>());
            RXlist.Item1.Add("Normal", new List<string>());
            RXlist.Item2.Add("Error", new List<string>());
            RXlist.Item2.Add("Normal", new List<string>());
            string rx;
            Regex numRX = new Regex("{[0-9]*}");
            int i1;
            int i2;

            // Read the file and display it line by line.
            System.IO.StreamReader file = new System.IO.StreamReader(filename);
            file.ReadLine();
            while ((line = file.ReadLine()) != null)
            {

                type = line.Substring(line.IndexOf("Logger.") + 1, line.IndexOf('(') - line.IndexOf("Logger.") - 1);
                if (line.Contains("ErrorLevel.") || type.Contains("Error"))
                {
                    type = "Error";
                }
                else
                {
                    type = "Normal";
                }

                if (line.IndexOf('\"') != -1)
                {

                    i1 = line.IndexOf('\"') + 1;
                    i2 = line.LastIndexOf('\"') - i1;
                    rx = line.Substring(i1, i2);
                    rx = rx.Replace("\"", "");
                    rx = Regex.Escape(rx);
                    rx = numRX.Replace(rx, ".*");
                    if (rx.Length > 1 && rx[0] == '\\' && rx[1] != '(') // now working with parenthesis
                    {
                        rx = rx.Substring(1);
                    }

                    if (!rx.Equals(""))
                    {
                        RXlist.Item1[type].Add(rx);
                        RXlist.Item2[type].Add(line.Replace("\t", " "));
                    }


                }
                else
                {

                    RXlist.Item1[type].Add("(?!x)x");
                    RXlist.Item2[type].Add(line.Replace("\t", " "));
                }
            }
            RXlist.Item2["Normal"].Add(MainWindow.LINE_MISMATCH);
            RXlist.Item2["Error"].Add(MainWindow.LINE_MISMATCH);

            file.Close();
            return RXlist;
        }

        public static Dictionary<string, string> getClassAndNum(string filename)
        {
            string line;
            string classname;
            string lineNum;
            string final;
            Dictionary<string, string> can = new Dictionary<string, string>();

            int i1;
            int i2;
            int numPos = 0;
            // Read the file and display it line by line.
            System.IO.StreamReader file = new System.IO.StreamReader(filename);
            while ((line = file.ReadLine()) != null)
            {
                if (line.IndexOf(".cs") != -1)
                {

                    classname = line.Substring(0, line.IndexOf(".cs"));
                    numPos = line.IndexOf('\t') + 2;
                    lineNum = line.Substring(numPos, line.IndexOf('\t', numPos) - numPos);
                    final = classname + "|" + lineNum;
                    can.Add(final, line.Replace("\t", " "));
                }
            }

            file.Close();
            return can;
        }

        public static int getSecondsInRun(string[] firstLastDates)
        {
            string firstDate = firstLastDates[0];
            DateTime dtFirst = new System.DateTime(Int32.Parse(firstDate.Substring(0, 4)),
                                                   Int32.Parse(firstDate.Substring(5, 2)),
                                                   Int32.Parse(firstDate.Substring(8, 2)),
                                                   Int32.Parse(firstDate.Substring(11, 2)),
                                                   Int32.Parse(firstDate.Substring(14, 2)),
                                                   Int32.Parse(firstDate.Substring(17, 2)));
            string lastDate = firstLastDates[1];
            DateTime dtLast = new System.DateTime(Int32.Parse(lastDate.Substring(0, 4)),
                                                   Int32.Parse(lastDate.Substring(5, 2)),
                                                   Int32.Parse(lastDate.Substring(8, 2)),
                                                   Int32.Parse(lastDate.Substring(11, 2)),
                                                   Int32.Parse(lastDate.Substring(14, 2)),
                                                   Int32.Parse(lastDate.Substring(17, 2)));
            TimeSpan diffResult = dtLast.Subtract(dtFirst);
            return (int)diffResult.TotalSeconds;
        }
        public static string getTimeStringInRun(string[] firstLastDates)
        {
            string firstDate = firstLastDates[0];
            DateTime dtFirst = new System.DateTime(Int32.Parse(firstDate.Substring(0, 4)),
                                                   Int32.Parse(firstDate.Substring(5, 2)),
                                                   Int32.Parse(firstDate.Substring(8, 2)),
                                                   Int32.Parse(firstDate.Substring(11, 2)),
                                                   Int32.Parse(firstDate.Substring(14, 2)),
                                                   Int32.Parse(firstDate.Substring(17, 2)));
            string lastDate = firstLastDates[1];
            DateTime dtLast = new System.DateTime(Int32.Parse(lastDate.Substring(0, 4)),
                                                   Int32.Parse(lastDate.Substring(5, 2)),
                                                   Int32.Parse(lastDate.Substring(8, 2)),
                                                   Int32.Parse(lastDate.Substring(11, 2)),
                                                   Int32.Parse(lastDate.Substring(14, 2)),
                                                   Int32.Parse(lastDate.Substring(17, 2)));
            TimeSpan diffResult = dtLast.Subtract(dtFirst);
            return diffResult.ToString("h'h 'm'm 's's'");
        }


        public static List<string[]> getFirstLastDates(List<string[]> runs)
        {
            List<string[]> firstLastDates = new List<string[]>();
            string line;

            // GET FIRST DATE
            for (int i = 0; i < runs.Count; i++)
            {
                firstLastDates.Add(new string[2]);
                string firstDateLine = File.ReadAllLines(runs[i][0]).First();
                string lastDateLine = File.ReadAllLines(runs[i][runs[i].Length - 1]).Last();
                firstLastDates[i][0] = firstDateLine.Substring(0, 23);
                firstLastDates[i][1] = lastDateLine.Substring(0, 23);
            }

            return firstLastDates;
        }

        public static string getBuildNo(string filename)
        {
            System.IO.StreamReader file = new System.IO.StreamReader(filename);
            string number = file.ReadLine();
            return number;
        }

        //checks whether run is full sequential
        public static bool isSequential(string[] run)
        {
            //get first run num
            int lastRunNum = int.Parse(run[0].Substring(run[0].LastIndexOf(".") + 1));

            for (int i = 1; i < run.Length; i++)
            {
                int runNum = int.Parse(run[i].Substring(run[i].LastIndexOf(".") + 1));
                if (runNum != ++lastRunNum)
                    return false;
            }

            return true;
        }

        // strips string array of non log files
        public static List<string> removeNonLogFiles(string[] fileNames)
        {
            List<string> logFiles = new List<string>();
            for (int i = 0; i < fileNames.Length; i++)
            {
                string fileNameOnly = System.IO.Path.GetFileName(fileNames[i]);
                if (fileNameOnly.StartsWith("log_"))
                    logFiles.Add(fileNames[i]);
            }
            return logFiles;

        }

        // gets the run name prefix (for the tabs to separate runs)
        public static string getRunName(string fileName)
        {
            string fileNameOnly = System.IO.Path.GetFileName(fileName);
            return fileNameOnly.Substring(0, fileNameOnly.IndexOf("."));
        }

        // splits list of file names into list of different runs in numeric order
        public static List<string[]> runSplitter(string[] fileNames)
        {
            // SPLIT INTO RUNS
            Array.Sort(fileNames); // sort all files

            List<string[]> runs = new List<string[]>(); // to hold the different runs
            int runStart = 0; // starting index of run

            // get prefix of first file
            string prefix = fileNames[0].Substring(0, fileNames[0].IndexOf('.'));

            // loop through fileNames
            for (int i = 1; i < fileNames.Length; i++)
            {
                // found new run
                if (!fileNames[i].StartsWith(prefix))
                {
                    int length = i - runStart; // num elems in run
                    string[] run = new string[length];
                    Array.Copy(fileNames, runStart, run, 0, length);
                    runs.Add(run); // add run to runs

                    runStart = i; // set new start index
                    prefix = fileNames[i].Substring(0, fileNames[i].IndexOf('.'));
                }
            }

            // acount for end
            int lastlength = fileNames.Length - runStart; // num elems in run
            string[] lastrun = new string[lastlength];
            Array.Copy(fileNames, runStart, lastrun, 0, lastlength);
            runs.Add(lastrun); // add run to runs

            // SORT RUNS
            for (int i = 0; i < runs.Count; i++)
            {
                runs[i] = runs[i].OrderBy(s => int.Parse(s.Substring(s.LastIndexOf(".") + 1))).ToArray();
                if (!isSequential(runs[i]))
                {
                    MessageBox.Show("Run " + getRunName(runs[i][0]) + " not sequential");
                }
            }

            return runs;
        }


    }
}

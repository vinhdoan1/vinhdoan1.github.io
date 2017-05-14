using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevPartnerWebReceiver
{
    class Program
    {
        static void Main(string[] args)
        {
            DevPartnerWebReceiver.startReceiver(manipulater);
        }

        /** Param: Current 2D string array of data
         * Return: Updated 2D string array of data 
         * Updates the array of data from the csv based on the demands of the work processor.
         */
        public static string[][] manipulater(string[][] arr)
        {
            for (int i = 0; i < arr.Length; i++)
            {
                for (int j = 0; j < arr[i].Length; j++)
                {
                    arr[i][j] = "a";
                }
            }

            return arr;
        }
    }
}

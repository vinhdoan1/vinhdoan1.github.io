using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Threading;

namespace DevPartnerWebReceiver
{
    class DevPartnerWebReceiver
    {
        static IMongoDatabase DB;

        /** Param: A function that fills one 2D array with updated data from the other
         * Establishes a connection to the Mongo database and RabbitMQ servers, 
         * while providing a function that will asynchronously update the data 
         */
        public static void startReceiver(Func<string[][], string[][]> process)
        {
            //URI for the database server, using IP address, port #, and database name
            var conString = "mongodb://10.4.21.220:27017/DevPartnerWeb";
            MongoUrl url = new MongoUrl(conString);
            var Client = new MongoClient(url);
            DB = Client.GetDatabase("DevPartnerWeb");

            //Connecting to the RabbitMQ server for message queuing, using IP address and user credentials
            var factory = new ConnectionFactory() { HostName = "10.4.21.220", UserName = "abc", Password = "123" };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "hello",
                                    durable: false,
                                    exclusive: false,
                                    autoDelete: false,
                                    arguments: null);
                var consumer = new EventingBasicConsumer(channel);
                //Creates a console alert telling the user that the requested data has been added to the database
                consumer.Received += (model, ea) =>
                {
                    var body = ea.Body;
                    var message = Encoding.UTF8.GetString(body);
                    Console.WriteLine(" [x] Received {0}", message);
                    var name = message.Substring(0, message.IndexOf(" "));
                    var id = message.Substring(message.IndexOf(" ") + 1);

                    runProcess(name, id, process).Wait();

                    channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
                };
                channel.BasicConsume(queue: "hello",
                                    noAck: false,
                                    consumer: consumer);
                Console.WriteLine("Press [enter] to exit.");
                Console.ReadLine();
            }
        }


        private static async Task updateUser(string name, string id, string status, string processedId)
        {

            var userCollection = DB.GetCollection<BsonDocument>("usercollection");
            var userFilter = new BsonDocument("username", name);
            var userlist = await userCollection.Find(userFilter).ToListAsync();
            //Goes through status of the recently processed data for a user from unprocessed to processed 
            foreach (var user in userlist)
            {
                var userData = user["data"];
                var userDataLen = user["data"].AsBsonArray.Count;
                for (int i = 0; i < userDataLen; i++)
                {
                    if (userData[i]["unprocessedID"].Equals(id))
                    {
                        if (processedId != null)
                            userData[i]["processedID"] = processedId;
                        userData[i]["status"] = status;
                        var updoneresult = await userCollection.UpdateOneAsync(

                           Builders<BsonDocument>.Filter.Eq("username", name),
                           Builders<BsonDocument>.Update.Set("data", userData));
                        break;
                    }
                }


            }

        }

        private static async Task runProcess(string name, string id, Func<string[][], string[][]> process)
        {

            updateUser(name, id, "Processing", null).Wait();

            var dataCollection = DB.GetCollection<BsonDocument>("datacollection");
            var pDataCollection = DB.GetCollection<BsonDocument>("processeddatacollection");
            //Get intended object by its ID
            var idFilter = new BsonDocument("_id", new ObjectId(id));
            var dataList = await dataCollection.Find(idFilter).ToListAsync();

            foreach (var data in dataList)

            {
                //Parses the JSON file and converts it into a 2D string array to be processed
                string[][] amlNew = JsonConvert.DeserializeObject<string[][]>(data.ToDictionary()["data"].ToString());
                string[][] arr = process(amlNew);
                //Converts the updated array of data back into a JSON file to be added to the database
                string arrJson = JsonConvert.SerializeObject(arr);
                var processedId = ObjectId.GenerateNewId().ToString();
                var dataDoc = new BsonDocument
                   {
                       {"data", arrJson },
                       {"id", processedId }
                   };
                await pDataCollection.InsertOneAsync(dataDoc);
                updateUser(name, id, "Ready", processedId).Wait();

                break;
            }


        }

    }
}

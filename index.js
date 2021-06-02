const Discord = require("discord.js");
const bot = new Discord.Client()
require("dotenv").config();
const prefix = process.env.PREFIX;
const token = process.env.TOKEN;

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGOPASS, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(
    console.log("connected to the database")
).catch(err => {
    console.log(err)
})
const User = require("./model/user");

bot.on("ready", () => {
    console.log("bot is ready")
})

bot.on("messageUpdate", async(oldMessage, newMessage) => {
    if(oldMessage.content === newMessage.content){
        return;
    }
    if(!newMessage.guild.id === "849765842887114792") return;
    const args = newMessage.content.split(/ +/g);
    await User.findOne({
        userId: newMessage.author.id
    }, (err, data) => {
        if (err) console.log(err);
        for (let i = 0; i < args.length; i++) {
            const word = args[i];
            if(data.usedwords.includes(word)) return newMessage.author.send(`you edited a messages to a word you used before\nI grapped your ip and will report it for human trafficking if you do it again\nthe word was: \`${word}\`\nthe old message was \`${oldMessage.content}\`\nthe new message was \`${newMessage.content}\``).then(newMessage.delete({timeout: 500}))
        }
        for (let i = 0; i < args.length; i++) {
            const word = args[i];
            data.usedwords.push(word);
        }
        if(data.usedwords.length >= 100) data.shift();
        data.save().catch(err => console.log(err));
    })
})

bot.on("message", async(message) => {
    if(message.author.bot) return;
    if(!message.guild.id === "849765842887114792") return;
    const args = message.content.split(/ +/g);
    await User.findOne({
        userId: message.author.id
    }, (err, data) => {
        if (err) console.log(err);
        if(!data){
            const leuser = new User({
                userId: message.author.id,
                usedwords: args
            })
            leuser.save().catch(err => console.log(err));
            return message.channel.send(`welcome <@${message.author.id}> to the used words server type ${prefix}used for the words you used`)
        }else{
            if(message.content === `${prefix}used`){
                return message.author.send(`you used these words ${data.usedwords}`);
            }
            else{
                for (let i = 0; i < args.length; i++) {
                    const word = args[i];
                    if(data.usedwords.includes(word)) return message.author.send(`you used a word you used before\nI grapped your ip and will report it for human trafficking if you do it again\nthe word was: \`${word}\`\nthe message was \`${message.content}\``).then(message.delete({timeout: 500}))
                }
                for (let i = 0; i < args.length; i++) {
                    const word = args[i];
                    data.usedwords.push(word);
                }
                if(data.usedwords.length >= 100) data.shift();
                data.save().catch(err => console.log(err));
            }
        }
    })
})

bot.login(token)
require('dotenv').config()

//Skapar boten
const Discord = require('discord.js');
const bot = new Discord.Client();

//Printar att boten har startat
bot.on('ready', () => {
    console.log('Welcome aboard, Captain! All systems online.');
});

// ^^^ I N G E N   M E R   K O D   I N N A N   D E T T A ^^^
// ---------------------------------------------------------



//Sätter vilket tecken som triggrar boten
const triggerchar = "!";

//Detta sker varje gång ett meddelande dyker upp i chatten
bot.on('message', async message => {

    //Här lagras alla kanalers id så de kan refereras till senare
    const BotTestId = '467987882611703808';
    const MetalCarrotzId = '144838969513869319';

    function kanalId(kanalIndex){
        switch(message.guild.id){
            case BotTestId:
                const BotTestKanalArray = ['682253902003175424','682253933007208455','682253970575851637','682254508184961058','682254535762116609','682254558994366505'];
            return BotTestKanalArray[kanalIndex];
            
            case MetalCarrotzId:
                const MetalCarrotzKanalArray = ['640961774929313813','683040839915929602','683040848551739495','683040856445550666','683040858907476019','683040876351848622'];
            return MetalCarrotzKanalArray[kanalIndex];
        }
    }

    //Ser till att användaren har rätt roller på Metal Carrotz. Detta krävs inte på Bot Test-servern.
    let MetalCarrotzAdmin = false;
    if(message.guild.id == MetalCarrotzId && message.member.roles.cache.some(r => r.name === "Active")){
        MetalCarrotzAdmin = true;
    }
    else if(message.guild.id == BotTestId) {
        MetalCarrotzAdmin = true;
    }

    //RFA = Random From Array
    function RFA(arrayName){
        return arrayName[Math.floor(Math.random() * arrayName.length)];
    }
        
    //Kollar om meddelandet börjar med rätt tecken
    if (message.content.substring(0,1) == triggerchar){

        //Delar upp kommandomeddelandet i en array som innehåller varje kommandoargument
        let args = message.content.substring(1).split(" ");

        //Kollar första argumentet för att se vilket kommand som ska köras
        switch(args[0]){

            case 'gruppera':
                //Avbryter om användaren inte är i någon kanal
                if(message.member.voice.channel == null){
                    message.reply("du måste vara i en röstkanal!")
                    break;
                }

                //Kollar att användaren har rätt roller
                if(MetalCarrotzAdmin == false){
                    message.reply("du måste vara Active!")
                    break;
                }

                //Skapar en array där alla anslutna läggs till
                let grupperaArray = [];

                //Skapar arrayer där de olika lagmedlemmarna kommer hamna
                let groupBlue = [];
                let groupRed = [];
                let groupYellow = [];
                let groupGreen = [];
                let groupOrange = [];
                let groupPurple = [];

                //Hittar röstkanalen som meddelandet skickare kommer ifrån.
                let initiatingUserChannel = message.member.voice.channel;


                //Lägger till alla som är med i den röstkanalen i en array.
                //Vet inte riktigt hur forEach(function(guildMember) fungerar
                initiatingUserChannel.members.forEach(function(guildMember, guildMemberId){
                    grupperaArray.push(guildMemberId);
                });

                let antalSpelarePerGrupp;
                let antalGrupper;

                function groupPush(groupColor){
                    //Flyttar en slumpad medlem till en av färgarrayerna
                    groupColor.push(grupperaArray.splice(Math.floor(Math.random() * grupperaArray.length) , 1));
                }

                function skapaFärgGrupper(){
                    //Dessa loopar börjar med att lägga en slumpad spelare i varje grupp beroende på hur många grupper
                    //När alla grupper har fått en spelare får alla grupper en spelare till osv. till alla spelare är slut
                    for (let i = 0; i < antalSpelarePerGrupp; i++) {

                        for (let j = 0; j < antalGrupper; j++) {

                            if(grupperaArray.length != 0){
                                switch (j){
                                    case 0: groupPush(groupBlue); break;
                                    
                                    case 1: groupPush(groupRed); break;
                                    
                                    case 2: groupPush(groupYellow); break;
                                    
                                    case 3: groupPush(groupGreen); break;

                                    case 4: groupPush(groupOrange); break;

                                    case 5: groupPush(groupPurple); break;
                                }
                            }
                        }
                    }
                }

                function skapaGruppEmbed(namn, färg, groupColor, voiceChannelId){
                    //Påbörjar en MessageEmbed
                    let embedColor = new Discord.MessageEmbed().setTitle(namn).setColor(färg);

                    for (let c = 0; c < antalSpelarePerGrupp; c++) {
                        //Förvarje lagmedlem läggs en textrad till i embeden
                        if (groupColor[c] != null){
                            let tempUser = message.guild.members.cache.get(groupColor[c].toString());
                            embedColor.addField('\u200B', tempUser.user.username, true);
                            //Om flytta ("f") är på flyttas även medlemmarna till rätt kanal
                            if(args[3] == "f"){tempUser.voice.setChannel(voiceChannelId)};
                        }
                    }
                    //Skickar den färdiga embeden
                    message.channel.send(embedColor);
                }

                function skickaGruppEmbed(){
                    //Skapar varje embed för varje lag som kommer ha medlemmar i sig
                    if (antalGrupper >= 1){skapaGruppEmbed('Team Blue', 0x0000FF, groupBlue, kanalId(0))}
                    if (antalGrupper >= 2){skapaGruppEmbed('Team Red', 0xFF0000, groupRed, kanalId(1))}
                    if (antalGrupper >= 3){skapaGruppEmbed('Team Yellow', 0xFFFF00, groupYellow, kanalId(2))}
                    if (antalGrupper >= 4){skapaGruppEmbed('Team Green', 0x00BB00, groupGreen, kanalId(3))}
                    if (antalGrupper >= 5){skapaGruppEmbed('Team Orange', 0xFFAA00, groupOrange, kanalId(4))}
                    if (antalGrupper >= 6){skapaGruppEmbed('Team Purple', 0xDD00BB, groupPurple, kanalId(5))}
                }

                if (args[2] == "g") {

                    //Efterfrågas fler grupper än spelare sätts varje grupp till en spelare per grupp
                    if (args[1] > grupperaArray.length){
                        antalSpelarePerGrupp = 1;
                        antalGrupper = grupperaArray.length;
                    }
                    //Annars fördelas spelarna jämnt mellan grupperna.
                    else{
                        antalSpelarePerGrupp = Math.ceil(grupperaArray.length/args[1]);
                        antalGrupper = args[1];
                    }
                    skapaFärgGrupper();
                    skickaGruppEmbed();
                }
                else if (args[2] == "p") {

                    //Efterfrågas fler spelare per grupp än vad är anslutna blir det bara en stor grupp med alla anslutna
                    if (args[1] > grupperaArray.length){
                        antalSpelarePerGrupp = grupperaArray.length;
                        antalGrupper = 1;
                    }
                    //Annars fördelas spelarna jämnt mellan grupperna.
                    else{
                        antalSpelarePerGrupp = args[1];
                        antalGrupper = Math.ceil(grupperaArray.length/args[1]);
                    }
                    skapaFärgGrupper();
                    skickaGruppEmbed();
                }

                else {
                    //Om något skriver fel skickas rätt syntax
                    message.channel.send("Rätt syntax är: !gruppera <tal> <g/p> (f)");
                }
            break;

            case 'samla':
                message.delete();

                //Avbryter om användaren inte är i någon kanal
                if(message.member.voice.channel == null){
                    message.reply("du måste vara i en röstkanal!")
                    break;
                }

                //Kollar att användaren har rätt roller
                if(MetalCarrotzAdmin == false){
                    message.reply("du måste vara Active!")
                    break;
                }
                
                let samlingsKanal = message.member.voice.channel.id;
                let medlemmarAttFlytta = [];
                
                //Lägger alla medlemmar anslutna i kanaler i en gemensamm array
                for (let i = 0; i < 6; i++) {
                    if(message.guild.channels.cache.get(kanalId(i)).members != null){
                        message.guild.channels.cache.get(kanalId(i)).members.forEach(function(guildMember){
                            medlemmarAttFlytta.push(guildMember);
                        });
                    }
                }

                //Flyttar alla medlemmar till samma röstkanal
                for (let i = 0; i < medlemmarAttFlytta.length; i++) {
                    medlemmarAttFlytta[i].voice.setChannel(samlingsKanal);
                }
            break;

            case 'välj':
                if (args[1] != null){
                    //Plockar bort första argumentet, alltså "välj"
                    args.shift();
                    //Väljer ett av kvarvarande argument
                    let slumpatval = RFA(args);
                    //Skriver detta i chatten
                    message.channel.send(slumpatval);
                }
                //Om något skrivs fel presenteras rätt syntax
                else {
                    if(message.member.voice.channel == null){
                        //Presenterar rätt syntax
                        message.channel.send("Rätt syntax är: !välj <text> <text> <text> ...");
                    }
                    else {
                        //Annars väljs en medlem från den röstkanalen
                        let väljArray = [];
                        message.member.voice.channel.members.forEach(function(guildMember, guildMemberId){
                            väljArray.push(guildMember.user.username);
                        });
    
                        message.channel.send(RFA(väljArray));
                    }
                }
            break;

            case 'timer':
                let konsonanter = ['b','c','d','f','g','j','k','l','m','n','p','r','s','t','v'];
                let vokaler = ['a','e','i','o','u','y','å','ä','ö'];

                //Skapar ett slumpat namn åt timern eftersom man kan ha flera olika timers igång samtidigt
                let timerName
                if(args[3] != null){
                    timerName = args[3]
                } 
                else{
                    timerName = RFA(konsonanter).toUpperCase() + RFA(vokaler) + RFA(konsonanter) + RFA(vokaler) + RFA(konsonanter)
                }

                if(args[1] == null){
                    message.channel.send("Rätt syntax är: !timer <antal minuter> (antal sekunder) (timerns namn)")
                    break;
                }

                let totalTime = 0;
                if(args[2] == null){totalTime = args[1]*60*1000}
                else{totalTime = args[1]*60*1000 + args[2]*1000;}

                if(totalTime > 3600000){
                    message.reply("timern kan inte vara längre än en timme");
                    break;
                }

                function min(totalTidms){
                    antalMinuter = Math.floor(totalTidms/60000);
                    if(antalMinuter == 0){return "";}
                    else if(antalMinuter == 1){return "1 minut";}
                    else{return antalMinuter + " minuter";}
                };

                function sek(totalTidms){
                    antalSekunder = (totalTidms%60000)/1000;
                    if(antalSekunder == 0){return "";}
                    else if(antalSekunder == 1){return "1 sekund";}
                    else{return antalSekunder + " sekunder";}
                };

                let ochEllerInte = "";
                if(sek(totalTime) != "" && min(totalTime) != ""){
                    ochEllerInte = " och ";
                }

                if(totalTime >= 20000){
                    message.reply("timern " + timerName + " har startat och är " + min(totalTime) + ochEllerInte + sek(totalTime) + " lång");
                    await new Promise(t => setTimeout(t, totalTime/2));
                    message.reply("hälften av " + timerName + " har gått");
                    await new Promise(t => setTimeout(t, (totalTime/2)-10000));

                    let voiceChannel = message.member.voice.channel
                    if(voiceChannel != null){
                        voiceChannel.join().then(connection =>{
                            connection.play('./cyclopsCountdown.wav')
                        })
                    }

                    await new Promise(t => setTimeout(t, 10000));
                    message.reply(timerName + " är färdig");
                    await new Promise(t => setTimeout(t, 3000));
                    voiceChannel.leave()
                }
                else{
                    message.reply("timern " + timerName + " har startat och är " + min(totalTime) + ochEllerInte + sek(totalTime) + " lång");
                    await new Promise(t => setTimeout(t, totalTime/2));
                    message.reply("hälften av " + timerName + " har gått");
                    await new Promise(t => setTimeout(t, totalTime/2));
                    message.reply(timerName + " är färdig");
                }
            break;

            case 'namn':
                if(args[1] == null || args[2] == null){
                    message.channel.send("Rätt syntax är: !namn <@Servermedlem> <nytt namn>")
                    break;
                }

                let mention = args[1] 
                if (mention.startsWith('<@') && mention.endsWith('>')) {
                    mention = mention.slice(2, -1);
            
                    if (mention.startsWith('!')) {
                        mention = mention.slice(1);
                    }

                    let newName = args[2]
                    for (let i = 3; i < args.length; i++) {
                        newName += " " + args[i]
                    }
                    
                    message.guild.members.fetch(mention).then(member => member.setNickname(newName))
                }
                else {

                } 
            break;

            case 'chat':
                if(args[1] == null){
                    message.channel.send("Rätt syntax är: !chat <ny besksrivning>")
                    break;
                }

                let description = ""
                for (let i = 1; i < args.length; i++) {
                    description += " " + args[i]
                }

                message.guild.channels.cache.get('144838969513869319').setTopic(description)
            break;

            case 'help':
            case 'hjälp':
                //Skickar en MessageEmbed som förklarar de olika kommandona boten kan göra
                let helpEmbed = new Discord.MessageEmbed().setTitle("Kommandon").setColor(0x00AAFF)
                    .addField("!gruppera", "Skapar slumpade grupper från de som är anslutna till din röstkanal")
                    .addField("!samla", "Flyttar alla anslutna i röstkanaler till din röstkanal")
                    .addField("!välj", "Slumpar fram ett av flera alternativ")
                    .addField("!timer", "Startar en timer")
                    .addField("!hjälp/!help", "Presenterar alla kommandon")
                    .addField("!namn", "Byt namn på en servermedlem")
                    .addField("!chat", "Byt beskrivning på #chat")
                    ;
                message.channel.send(helpEmbed);
            break;

            default:
                message.channel.send("Okänt kommando, skriv !hjälp eller !help för en lista med kommandon")
            break;
        }
    }
});

bot.login(process.env.TOKEN);
# Welcome to the MangKeKe Bot!

This is a discord bot that helps you keep track of the manga you are currently reading. I was inspired to create this when I was in bed at 2am reading manga. I accidentally deleted all 500 tabs on my phone and I couldn't figure out what chapter I was on for the mangas I was reading (Ｔ▽Ｔ) . I want a way to keep track of my mangas but I hate spread sheets and the apps for them on my phone. So instead I decided to use a discord bot that I could text so it would update the google sheet for me and let me know when my mangas have updated. I already text my friends as if they were my notes so instead of bothering them I will use this bot! ٩(⊙‿⊙)۶

## How to run the bot
Create a google sheet with your manga data. Follow instructions to set up google sheet api (create a google cloud project and get an oauth key) . Run the googleSheets.js to create credentials (crendetials.json and token.json) . 
Follow instructions on discord.js to add the discord bot to your server. Then run the index.js 
>  node index.js

## Commands

### getmanga
> /getmanga {name}

Returns the manga data

![image](https://github.com/user-attachments/assets/6fcb8ebb-e4d2-4ea6-899c-3a0b35599c21)



### addmanga
> /addmanga {title} {chapter} {link} {day} {description} {image}

Add manga to the spreadsheet

![image](https://github.com/user-attachments/assets/5cfd7b12-400f-44a5-bd0d-68ca0ad67cad)

Google sheet
![image](https://github.com/user-attachments/assets/30faa904-2e71-4bb3-8f4d-133e979c6f81)



### updatechapter
> /updatechapter {title} {chapter}

Update the chapter of the manga you're reading

![image](https://github.com/user-attachments/assets/6f79b80f-ff5e-415a-bd27-263bfadd256b)


### getMangaOfTheDay is not a command but a core functionality
This function schedules a message at 1am everyday to send the mangas that should have releases. So for example, Kagurabachi updates on sunday. Therefore on sunday you should see a message from the bot reminding you to read the new chapter!

![image](https://github.com/user-attachments/assets/e8ccaebc-8d2f-4ddd-8646-9d74dcdaa60f)


## Resources 
- https://developers.google.com/sheets/api/quickstart/nodejs 
- https://discordjs.guide/creating-your-bot/main-file.html#running-your-application


Thank you for checking out this project! 💯




const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '6407702126:AAGOMrdIaFmfqcCKKn3xxzPLK9k8DDBxWmg'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Число от 1 до 9`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `Отгадывай`, gameOptions)
}

bot.setMyCommands([
    {command: '/start', description: 'Поле приветсвтя'},
    {command: '/info', description: 'Информацио о юзернейме'},
    {command: '/game', description: 'Инвормация об игре'}
])

bot.on('message', async msg => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === '/start') {
        await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/320/625/3206250e-cee1-4819-9061-668f394a9df6/3.jpg')
        return bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name}`)
    }
    if (text === '/info') {
        return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}`)
    }
    if (text === '/game') { 
        return startGame(chatId);

    }

    return bot.sendMessage(chatId, `Я тебя не понимаю`)
})

bot.on ('callback_query', msg => {
    const data = msg.data;
    const chatId = msg.message.chat.id

    if (data === '/again') {
        return startGame(chatId);
    }
    if (data === 'back') {
        return startGame(chatId);
    }

    console.log(msg)

    if (parseInt(data) === chats[chatId]){
        return bot.sendMessage(chatId, `ты выбрал цифру ${data}, Поздравляем, ты отгадал ${chats[chatId]}`, againOptions)
    } else {
        return bot.sendMessage(chatId, `ты выбрал цифру ${data}, не отгадал - правильная ${chats[chatId]}`, againOptions)
    }
})

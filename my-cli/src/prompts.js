import Enquirer from 'enquirer'
import { categories, listCategoryItems, addItem, updateItem } from './utils.js'


const { prompt } = Enquirer

const categoryQuestions = [
    {
        type: 'autocomplete',
        name: 'category',
        message: 'Category',
        choices: categories,
    },
]

export const promptListIds = async () => {
    const { category } = await prompt(categoryQuestions)
    return listCategoryItems(category) 
}
// await promptListIds()

const addQuestions =  [
    ...categoryQuestions,
    {
        type: 'input',
        name: 'id',
        message: 'ID',
    },
    {
        type: 'input',
        name: 'name',
        message: 'Name',
    },
    {
        type: 'input',
        name: 'amount',
        message: 'Amount',
    },
    {
        type: 'input',
        name: 'info',
        message: 'Info',
    },
]

export const promptAddItem = async () => {
    const { category, id, name, amount, info } = await prompt(addQuestions)
    return addItem(category, id, name, amount, info) 
}
// promptAddItem()

const updateQuestions = [
    {
        type: 'input',
        name: 'id',
        message: 'ID',
    },
    {
        type: 'input',
        name: 'amount',
        message: 'Amount'
    }
]

export const promptUpdateItem = async () => {
    const { id, amount } = await prompt(updateQuestions)
    return updateItem(id, amount)
}
// promptUpdateItem()

const commandList = ['add', 'update', 'list', "list by ID's", "help", "exit"]
const commandsQuestions = [
    {
        type: 'autocomplete',
        name: 'command',
        message: 'Command',
        choices: commandList,
    }
]
export const promptCommand = async () => {
    const { command } = await prompt(commandsQuestions)
    return command
}
// promptCommand()
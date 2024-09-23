#!/usr/bin/env node

/**
 * At the very first line, this command allows 
 * Operating System know what interpreter to execute the text of the file with.
 * Just on Unix(-like) system.
 */

// import got from 'got'
import { Command } from 'commander' // <- commander package
import { 
    updateItem, 
    addItem, 
    listCategories, 
    listCategoryItems,
    log,
    error,
    displayText,
    displayInfo,
    categories,
} from '../src/utils.js' // <- sub-command, customizing CLI
import { 
    promptCommand,
    promptAddItem,
    promptUpdateItem,
    promptListIds,
} from '../src/prompts.js' // <- adding interactivity


/**
 * Customizing CLI, Adding interactivity
 */
const program = new Command()

export const interactiveApp = async (cmd) => {
    log(displayText(`Back Office My App`))
    log(displayInfo(`Interactive Mode`))
    try {
        const command = cmd ?? await promptCommand()
        switch (command) {
            case 'add':
                log(displayInfo('Add Item'))
                await promptAddItem()
                return interactiveApp()
            case 'update':
                log(displayInfo('Update Item'))
                await promptUpdateItem()
                return interactiveApp()
            case 'list':
                log(displayInfo('List Categories'))
                await listCategories()
                return interactiveApp()
            case "list by ID's":
                log(displayInfo('List Category Items'))
                await promptListIds()
                return interactiveApp()
            case 'help':
                program.help()
            case 'exit':
                process.exit(0)
        }
    } catch (err) {
        error(err)
        process.exit(1)
    }
}
// await interactiveApp()

program.name('my-cli')
    .description('Back Office fo My App')
    .version('1.0.0')
    .option('-i, --interactive', 'Run App in Interactive Mode')
    .action(() => {})
program.command('update')
    .description('Updated an Order')
    .option('-i, --interactive', 'Run Update Command in Interactive Mode')
    .argument('[id]', 'Order ID')
    .argument('[AMOUNT]', 'Order Amount')
program.command('add')
    .description('Add Product by ID to a Category')
    .option('-i, --interactive', 'Run Add Command in Interactive Mode')
    .argument('[CATEGORY]', 'Product Category')
    .argument('[ID]', 'Product Id')
    .argument('[NAME]', 'Product Name')
    .argument('[AMOUNT]', 'Product RRP')
    .argument('[INFO...]', 'Product Info')
program.command('list')
    .description('List Categories')
    .option('-i, --interactive', 'Run List Command in Interactive Mode')
    .option('-a, --all', 'List All Categories')
    .argument('[CATEGORY]', 'Category to List IDs for')
program.parse()

async function main(program) {
    const command = program.args.at(0) || ''
    const cliArgs = program.args.slice(1) || []
    const options = program.opts() || {}
    if (!command && !options.interactive) return program.help()
    if (!command && options.interactive) return interactiveApp()
    if (command && options.interactive) return interactiveApp(command)
    if (options.interactive && cliArgs.length > 0) {
        throw new Error('Cannot specify both interactive and command')
        process.exit(1)
    }
    switch (command) {
        case 'add': {
            const [ category, id, name, amount, info ] = cliArgs
            if (
                !categories.includes(category) ||
                !category ||
                !id ||
                !name ||
                !amount
            ) throw new Error('Invalid arguments specified')
            await addItem(category, id, name, info)
            break
        }
        case 'update': {
            const [ id, amount ] = cliArgs
            if (!id || !amount) throw new Error('Invalid arguments specified')
            await updateItem(id, amount)
            break
        }
        case 'list': {
            const { all } = options
            console.log(options);
            const [ category ] = cliArgs
            if (all && category) throw new Error("Cannot specify both category and 'all'")
            if (all || category === 'all') {
                listCategories()
            } else if (categories.includes(category)) {
                await listCategoryItems(category)
            } else {
                throw new Error('Invalid category specified')
            }
            break
        }
        default: 
            await interactiveApp()
    }
}
main(program)
/* ---------------------------------- */

/**
 * Using 'commander' package
 */
// const program = new Command()
//
// program.name('my-cli')
//     .description(`Back Office for My App`)
//     .version('1.0.0')
//
// program.command('update')
//     .argument('<ID>', 'Order ID')
//     .argument('<AMOUNT>', 'Order Amount')
//     .action(async (id, amount) => { await updateItem(id, amount) })
//
// program.command('add')    
//     .description('Add Product by ID to a Category')
//     .argument('<CATEGORY>', 'Product Category')
//     .argument('<ID>', 'Product ID')
//     .argument('<NAME>', 'Product Name')
//     .argument('<AMOUNT>', 'Product RRP')
//     .argument('[INFO...]', 'Product Info')
//     .action(async (category, id, name, amount, info) => { await addItem(category, id, name, amount, info) })
//
// program.command('list')
//     .description('List Categories')
//     .argument('[CATEGORY]', 'Category to List IDs for')
//     .option('-a, --all', 'List All Categories')
//     .action(async (arg, opt) => {
//         if (arg && opt.all) {
//             throw new Error("Cannot specify both category and 'all'")
//         }
//         if (opt.all || arg === 'all') {
//             listCategories()
//         } else if (arg === 'confectionery' || arg === 'electronics') {
//             await listCategoryItems(arg)
//         } else {
//             throw new Error('Invalid category specified')
//         }
//     })
//
// program.parse()
/* ------------------------- */


/**
 * Before using 'commander' package
 */
// const API = 'http://localhost:3000'
//
// const usage = (msg) => { console.log(`\n${msg}\n`) }
// async function updateItem(id, amount) {
//     usage(`Updating order ${id} with amount ${amount}`)
//     try {
//         if (isNaN(+amount)) {
//             usage(`Error: <AMOUNT> must be a number`)
//             process.exit(1)
//         }
//         await got.post(`${API}/orders/${id}`, {
//             json: { amount: +amount }
//         })
//         usage(`Order ${id} updated with amount ${amount}`)
//     } catch (err) {
//         console.error(err.message)
//         process.exit(1)
//     }
// }
//
// const usage = (msg='Back Office for My App') => {
//     console.log(`\n${msg}\n`)
//     console.log(`Usage: cmd <ID> <AMOUNT>`)
// }
//
// const argv = process.argv.slice(2)
// if (argv.length < 2 ) {
//     usage()
//     process.exit(1)
// }
// const [argID, argAmount] = argv
// const amount = parseInt(argAmount)
// if (isNaN(amount)) {
//     usage(`Error: <AMOUNT> must be a number`)
//     process.exit(1)
// }
// 
// try {
//     await got.post(`${API}/orders/${argID}`, {
//         json: { amount }
//     })
//     console.log(`Order ${argID} updated with amount ${amount}`)
// } catch (err) {
//     console.log(err.message)
//     process.exit(1)
// }
/* -------------------------------- */
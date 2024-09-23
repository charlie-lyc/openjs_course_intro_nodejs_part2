import got from 'got'
import { 
    bgBlue,
    bgCyan,
    bgGreen,
    bgPurple,
    bgRed,
    bgWhite,
    bgYellow,
    txBlue,
    txCyan,
    txGreen,
    txPurple,
    txRed,
    txWhite,
    txYellow,
} from './colors.js'


const API = 'http://localhost:3000'

export const log = (msg) => console.log(`\n${msg}\n`)
// export const error = (msg) => console.error(`\n${msg}\n`)
export const error = (msg) => { 
    console.error(`${bgRed.inverse(`⚠️ Error : `)}\n${txRed(msg)}\n`) 
}

const timestamp = () => new Date().toLocaleDateString()
export const displayTimestamp = () => bgPurple(timestamp())
export const displayInfo = (msg) => bgYellow.bold(`ℹ️  ${msg ?? 'Info : '}`)
export const displaySuccess = (msg='') => bgCyan.inverse.bold(`✅ Success! ${msg}`)
export const displayCategory = (category) => txGreen.bold.underline(category)
export const displayAmount = (amount) => txYellow.bold.underline(`${amount}`)
export const displayID = (id) => txCyan.bold(id)
export const displayName = (name) => txCyan(name)
export const displayRRP = (rrp) => txYellow.bold(`$${rrp}`)
export const displayText = (msg) => txPurple(msg)
export const displayKey = (key) => txBlue.bold(key)

/* $ my-cli update - Order more item */
export async function updateItem(id, amount) {
    // log(`Updating order ${id} with amount ${amount}`)
    log(displayTimestamp())
    log(`
        ${displayInfo('Updating Order')} 
        ${displayID(id)} 
        ${displayText('with amount')} 
        ${displayAmount(amount)}
    `)
    try {
        if (isNaN(+amount)) {
            usage(`Error: <AMOUNT> must be a number`)
            process.exit(1)
        }
        await got.post(`${API}/orders/${id}`, {
            json: { amount: +amount }
        })
        // log(`Order ${id} updated with amount ${amount}`)
        log(`
            ${displaySuccess()} 
            ${displayText('Order')} 
            ${displayID(id)} 
            ${displayText('updated with amount')} 
            ${displayAmount(amount)}
        `)
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}


/* $ my-cli add - Add new item */
export async function addItem(...args) {
    let [ category, id, name, amount, info ] = args
    // log(`Adding item ${id} with amount ${amount}`)
    log(displayTimestamp())
    log(`
        ${displayInfo('Request to add item to category')} 
        ${displayCategory(category)}
    `)
    log(`
        ${displayText('Adding item')} 
        ${displayID(id)} 
        ${displayText('with amount')} 
        ${displayAmount(`${amount}`)}
    `)
    try {
        if (isNaN(+amount)) {
            error(`Error: <AMOUNT> must be a number`)
            process.exit(1)
        }
        await got.post(`${API}/${category}`, {
            json: {
                id,
                name,
                rrp: +amount,
                info,
            }
        })
        // log(`Item "${id} : ${name}" has been added to the ${category} category`)
        log(`
            ${displaySuccess('Product Added! :')} 
            ${displayID(id)} 
            ${displayName(name)} 
            ${displayText('has been added to the')} 
            ${displayCategory(category)} 
            ${displayText('category')}
        `)
    } catch (err) {
        error(err.message)
        process.exit(1)
    }
}

export const categories = ['confectionery', 'electronics']

/* $ my-cli list - List categories or each category's items */
export function listCategories() {
    // log(`Listing categories`)
    log(displayTimestamp())
    log(displayInfo('Listing Categories'))
    try {
        log(displayText('Categories received from API : '))
        for (const category of categories) log(category)
    } catch (err) {
        error(err.message)
        process.exit(1)
    }
}
export async function listCategoryItems(category) {
    // log(`Listing IDs for category ${category}`)
    log(displayTimestamp())
    log(displayInfo('List IDs'))
    try {
        const resultList = await got(`${API}/${category}`).json()
        log(displaySuccess('IDs received from API : '))
        for (const item of resultList) {
            // log(`${item.id}: ${item.name} - $${item.rrp}\nProduct Info:\t${item.info}`)
            log(`
                ${displayKey('ID : ')}\t${displayID(item.id)} 
                ${displayKey('Name : ')}\t${displayName(item.name)} 
                ${displayKey('RRP : ')}\t${displayRRP(item.rrp)} 
                ${displayKey('Product Info : ')}\n
                \t${displayText(item.info)}
            `)
        }
    } catch (err) {
        error(err.message)
        process.exit(1)
    }
}
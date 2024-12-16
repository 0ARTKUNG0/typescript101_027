class Customer {
    private name:string;
    private address:string;

    constructor (name:string, address:string){
        this.name = name;
        this.address = address;
    }

    public getInfo():string{
        return "Name: "+ this.name + "\nAddress: "+ this.address;
    }
}

class Order {
    private customer: Customer;
    private orderDetails: OrderDetail[]=[];
    private payment: Payment=new Cash(0,0);
    private date: string;
    private status: string;

    constructor(customer: Customer,date: string,status:string){
        this.customer = customer;
        this.date = date;
        this.status = status;
    }
    public calcSubtotal(){
        let subtotal = 0;
        for(let i = 0; i <this.orderDetails.length;i++){
            subtotal = subtotal + this.orderDetails[i].calcSubTotal();
        }
        return subtotal;
    }

    public calcTax(){
        let vat = 0;
        for(let i = 0; i <this.orderDetails.length;i++){
            vat = vat + this.orderDetails[i].calcTax();
        }
        return vat;
    }
    public calcTotal(){
        return this.calcSubtotal() + this.calcTax();
    }
    public calcTotalWeight(){
        let weight = 0
        for(let i = 0; i <this.orderDetails.length;i++){
            weight = weight + this.orderDetails[i].calcWeight();
        }
        return weight;
    }
    public addOrderDetails(orderDetails: OrderDetail){
    this.orderDetails.push(orderDetails)
    }
    public payOrder(payment: Payment){
    this.payment=payment
    }
    public getPayment():Payment{
        return this.payment;
    }
    public printOrderDetails()
    {
        for(let i = 0; i <this.orderDetails.length;i++){
            this.orderDetails[i].printDetail();
        }
    }
}

class OrderDetail{
    private item: Item;
    private quantity: number;
    private taxStatus: string;
    constructor(item: Item,quantity: number,taxStatus: string){
    this.item = item;
    this.quantity = quantity;
    this.taxStatus = taxStatus;
    }

    public calcSubTotal(){
        return this.quantity*this.item.getPriceForQuantity();
    }
    public calcWeight(){
        return this.quantity * this.item.getShippingWeight();
    }
    public calcTax(){
        if(this.taxStatus === "not included"){
            return this.quantity * this.item.getTax();
        }
        return 0;
    }
    public printDetail(){
        console.log("Item: "+this.item.getName() + "\t"+ this.quantity + "\t"+ this.calcSubTotal()+"฿");
    }
}

class Item {
    private shippingWeight: number;
    private description: string;
    private price:number;

    constructor(shippingWeight: number,description:string, price:number){
        this.shippingWeight = shippingWeight;
        this.price = price;
        this.description = description;
    }
    public getPriceForQuantity(){
        return this.price;
    }

    public getTax(){
        return this.price * 0.07;
    }

    public getShippingWeight():number{
        return this.shippingWeight;
    }
    public inStock(){
        return true;
    }
    public getName():string{
        return this.description;
    }
    public getInfo():string{
        return "Name:"+ this.description+", Price:"+this.price +"฿, Weigth:"+this.shippingWeight+" kg.";
    }
}

abstract class Payment{
    private amount:number;

    constructor(amount:number){
        this.amount=amount;
    }

    public getAmount():number{
        return this.amount;
    }
}
class Check extends Payment {
    private name:string;
    private bankID:string;

    constructor (name:string, bankID:string, amount:number){
        super(amount)
        this.name = name;
        this.bankID = bankID;
    }
    public authorized(){

    }
}

class Credit extends Payment {
    private number:string;
    private type:string;
    private expDate:string;

    constructor (number:string, type:string, amount:number, expDate:string){
    super(amount)
    this.number = number;
    this.type = type;
    this.expDate =expDate;
    }
    public authorized(){

    }
}

class Cash extends Payment {
    private cashTendered: number;

    constructor(amount:number, cashTendered: number){
        super(amount);
        this.cashTendered = cashTendered;
    }
    public getCashTendered(): number{
        return this.cashTendered;
    }
    public getChange():number{
        return this.cashTendered - this.getAmount();
    }
}

// Create customer
const customer1 = new Customer("Mr. Choke Dee", "85 Malaiman, Nakhonpathom");
console.log(customer1.getInfo());

// Create items
const item1 = new Item(1.5, "Lotus's Water", 20);
const item2 = new Item(0.05, "Lays Chips", 30);
const item3 = new Item(0.1, "Mama", 10);

// Display item info
console.log(item1.getInfo());
console.log(item2.getInfo());
console.log(item3.getInfo());

// Create order and order details
const order1 = new Order(customer1, "16/12/2567", "In Progress");

const orderDetail1 = new OrderDetail(item1, 20, "not included");
const orderDetail2 = new OrderDetail(item2, 10, "not included");
const orderDetail3 = new OrderDetail(item3, 16, "not included");

order1.addOrderDetails(orderDetail1);
order1.addOrderDetails(orderDetail2);
order1.addOrderDetails(orderDetail3);

const amount = order1.calcTotal();

console.log("\nOrder Details:"); // Add a header for clarity
order1.printOrderDetails(); // Print order details

// Payment
const cash = new Cash(amount, 1000);

console.log("Receive: " + cash.getCashTendered());

order1.payOrder(cash);

console.log("Total: " + order1.getPayment().getAmount());
console.log("Receive: " + (order1.getPayment() as Cash).getCashTendered());
console.log("Change: " + (order1.getPayment() as Cash).getChange());

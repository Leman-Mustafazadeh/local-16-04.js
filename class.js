class Product {
    static id =1
    constructor(name,img,costPrice,salePrice,discountPercentage){
        this.id = Product.id++
        this.name = name
        this.img = img
        this.costPrice = costPrice
        if(salePrice>costPrice) this.salePrice = salePrice
        else throw new Error("sale price cannot be less")
        if(discountPercentage>=0 && discountPercentage<=100)
        this.discountPercentage = discountPercentage
    else throw new Error("discount persentage should be between 0-100")
    this.discountPercentage = discountPercentage
    }
    calcProfit(){
        const profit = this.salePrice*this.discountPercentage/100-this.costPrice
        return profit
    }
    calcPrice(){
       return Number(this.salePrice-(this.salePrice*this.discountPercentage/100)).toFixed(2)
    }
}
export default Product
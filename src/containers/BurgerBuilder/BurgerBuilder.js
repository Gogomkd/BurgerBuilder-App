import React, { Component } from 'react';
import Aux from '../../hoc/Auxillery/Auxillery';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';


const INGREDIANT_PRICES = {
    salad: 1.3,
    cheese: 0.9,
    meat: 2,
    bacon: 1.5
}

class BurgerBuilder extends Component {
    // constructor(props){
    //     super(props)
    //     this.state = {...}
    // }

    state = {
        ingrediants: null,
        totalPrice: 5,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('https://react-myburger-7c6f5.firebaseio.com/ingrediants.json')
            .then(result => {
                this.setState({ ingrediants: result.data })
            })
            .catch(e => {
                this.setState({ error: true })
            })
    }

    purchaseCanselHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHalnder = () => {
        // this.purchaseCanselHandler();
        //alert('You Continue');
        this.setState({ loading: true })
        const order = {
            ingrediants: this.state.ingrediants,
            price: this.state.totalPrice,
            customer: {
                name: 'Goran',
                adress: {
                    street: 'Test',
                    zipCode: 'Zip',
                    state: 'State',
                },
                email: 'testEmail'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
            .then(res => {
                this.setState({ loading: false, purchasing: false })
                console.log(res);

            }).catch(e => {
                this.setState({ loading: false, purchasing: false })
                console.log(e);

            }); //for firebase to function corectlly .json is required

    }

    purchasingHandler = () => {
        this.setState({ purchasing: true })
    }

    updatePurchaseState(ingrediants) {

        const sum = Object.keys(ingrediants)
            .map(igKey => {
                return ingrediants[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0)
        this.setState({ purchasable: sum > 0 })
    }

    addIngrediantHandler = (type) => {
        const oldCount = this.state.ingrediants[type];
        const newCount = oldCount + 1;
        const updatedIngrediants = {
            ...this.state.ingrediants
        };
        updatedIngrediants[type] = newCount;
        const priceAddition = INGREDIANT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({ totalPrice: newPrice, ingrediants: updatedIngrediants })
        this.updatePurchaseState(updatedIngrediants);
    }

    removeIngrediantHandler = (type) => {
        const oldCount = this.state.ingrediants[type];
        if (oldCount <= 0) {
            return;
        }
        const newCount = oldCount - 1;
        const updatedIngrediants = {
            ...this.state.ingrediants
        };
        updatedIngrediants[type] = newCount;
        const priceDeduction = INGREDIANT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({ totalPrice: newPrice, ingrediants: updatedIngrediants })
        this.updatePurchaseState(updatedIngrediants);
    }

    render() {

        const disabledInfo = {
            ...this.state.ingrediants
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0; // This will return true of false for each type
        }                                               //so i stick it to the state and have one more info
        // about weather button should be disabled or not

        let burger = this.state.error ? <p>Ingrediants cant be loaded</p> : <Spinner />;
        let orderSummary = null;
        if (this.state.ingrediants) {
            burger = (
                <Aux>
                    <Burger ingrediants={this.state.ingrediants} />
                    <BuildControls addIngrediant={this.addIngrediantHandler}
                        removeIngrediant={this.removeIngrediantHandler}
                        disabled={disabledInfo}
                        purchasable={this.state.purchasable}
                        price={this.state.totalPrice}
                        order={this.purchasingHandler} />
                </Aux>
            );

            orderSummary = <OrderSummary ingrediants={this.state.ingrediants}
                purchaseCansel={this.purchaseCanselHandler}
                purchaseContinue={this.purchaseContinueHalnder}
                price={this.state.totalPrice} />
        }
        if (this.state.loading) {
            orderSummary = <Spinner />
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCanselHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}


export default withErrorHandler(BurgerBuilder, axios);
import React, { Component } from 'react';
import Aux from '../../hoc/Auxillery/Auxillery';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
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
        ingrediants: {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0
        },
        totalPrice: 5,
        purchasable: false,
        purchasing: false
    }

    purchaseCanselHandler = () => {
        this.setState({ purchasing: false })
    }

    purchaseContinueHalnder = () => {
        // this.purchaseCanselHandler();
        alert('You Continue');

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
        return (                                        // about weather button should be disabled or not.
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCanselHandler}>
                    <OrderSummary ingrediants={this.state.ingrediants}
                        purchaseCansel={this.purchaseCanselHandler}
                        purchaseContinue={this.purchaseContinueHalnder}
                        price={this.state.totalPrice} />
                </Modal>
                <Burger ingrediants={this.state.ingrediants} />
                <BuildControls addIngrediant={this.addIngrediantHandler}
                    removeIngrediant={this.removeIngrediantHandler}
                    disabled={disabledInfo}
                    purchasable={this.state.purchasable}
                    price={this.state.totalPrice}
                    order={this.purchasingHandler} />


            </Aux>
        );
    }
}


export default BurgerBuilder;
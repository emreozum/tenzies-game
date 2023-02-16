import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollLength, setRollLength] = React.useState(0)
    const [isWin, setIsWin] = React.useState({winState: "Roll to start"})
    const [time, setTime] = React.useState(0)
    const [bestTime, setBestTime] = React.useState(0)
   
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setRollLength(0)
            setIsWin({winState: "You Win!"})
            if(time<bestTime || bestTime===0){
                setBestTime(time)
            }
        }
    }, [dice])

    React.useEffect(() => {
        
        if(rollLength>0){
            const interval = setInterval(() => {
                setTime(time => time + 1)
            }, 1000)
            return () => clearInterval(interval)
        }
        else{
         setTime(0)
        }
        
    }, [rollLength])

    

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(rollLength<15){
            setIsWin({winState: "Keep rolling"})
            setRollLength(oldRollLength => oldRollLength + 1)
        }
        else{
            setRollLength(0)
            setDice(allNewDice())
            setIsWin({winState: "You Lose!"})

        }
        
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div>
                <p>{isWin.winState}</p>
            </div>
            <div>
                <p>Rolls: {rollLength}</p>
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies || rollLength>=15 ? "New Game" : "Roll"}
            </button>
            <div>
                <p>Time: {time} Best Time: {bestTime}</p>
            </div>
            
        </main>
    )
}
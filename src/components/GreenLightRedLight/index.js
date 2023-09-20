

import {Component} from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import {v4 as uuidv4} from 'uuid'
import "./index.css"

const initialState = {
    name: "",
    email: "",
    level: 'easy',
    color: "yellow-bg",
    score: 0,
    seconds: 40,
    clicks: 0,
    resultText: '',
    gameFinished: false,
    leaderBoard: [],
    formSubmitted: false,
    errorName: "",
    errorEmail: "",
    errorForm: ''
  };

class GreenLightRedLight extends Component{
    state = initialState
    intervalId = null;
    timerId = null;

    randomColorGenerator = () => { //generating the random colours for every 1 sec.
        const{formSubmitted} = this.state 
        if(formSubmitted === true){
            clearInterval(this.intervalId);
            clearInterval(this.timerId)  // Clearing any existing intervals
            const { level } = this.state;
            if (level === "easy") {
              this.setState({ clicks: 10 }); // setting up easy,medium,hard levels
            } else if (level === "medium") { 
              this.setState({ clicks: 15 });
            } else {
              this.setState({ clicks: 25 });
            }
            this.timerId = setInterval(this.timerDecrease, 1000); // setting up interval that decreases from 40 to 0 
            this.intervalId = setInterval(() => {
              const set = Math.random() < 0.5 ? 'red-bg' : 'green-bg';
              this.setState({ color: set,resultText: "",formSubmitted: !formSubmitted });
            }, 1000);
        }
         else{
             this.setState({errorForm: "Please fill the form to play the game"})
         }
       
      };

      onClickBox = (obj) => {   // updating the score for every green box clicked
        const clickedId = obj.target.id;
        const { score, seconds, clicks} = this.state;
        if (clickedId === "green-bg") {
            if(score < clicks){
                this.setState((prevState) => ({
                    score: prevState.score + 1,
                  }),this.updateLeaderBoard)
                    if (score === clicks - 1 && seconds !== 0) {
                      this.setState({ resultText: `Congratulations! You won the game!, You Clicked within ${40-seconds} seconds`,gameFinished: true});
                      clearInterval(this.timerId);
                      clearInterval(this.intervalId);
                    } else if (score !== clicks - 1 && seconds === 0) {
                      this.setState({ resultText: "Oops! You lost the game!",gameFinished: true});
                      clearInterval(this.timerId);
                      clearInterval(this.intervalId);
                    }
                  ;
            }
        } else {
          this.onRedClicked();
        }
      };


      
      
      timerDecrease = () => {  // function used for decrease the time 
        this.setState((prevState) => ({
          seconds: prevState.seconds - 1,
        }), () => {
          if (this.state.seconds === 0) {
            this.onTimeUp();
          }
        });
      };

      onRedClicked = () => {  // function for ending the game whenever user clicked the red box
        clearInterval(this.intervalId);
        clearInterval(this.timerId);
        this.setState({ resultText: "Oops! You lost the game!",gameFinished: true });
      };

      onTimeUp = () => { // function for ending the game whenever the user failed to click the n clicks in y seconds 
        clearInterval(this.intervalId);
        clearInterval(this.timerId);
        this.setState({ resultText: "Time's up! You lost the game!",gameFinished: true });
      };


  

   userDetails = (event) => { 
    event.preventDefault();
    this.validateForm();
  };

  updateLeaderBoard = () => { // function for updating the leaderboard
    const {formSubmitted,name,score,email,level} = this.state
    const newMember = {
        name: name,
        score:score,
        email:email,
        level: level,
        isGamePlayed: false,
        id: uuidv4()
    }
    console.log(newMember)
     if(formSubmitted){
        this.setState((prevState) => ({
           leaderBoard: [...prevState.leaderBoard,newMember], // adding the new user to leaderboard using spreed operator
           name: "",
           email: "",
           level: "easy"
        }))
     }
  }
  
  

  validateForm = () => { //validating the form.
    const { name, email } = this.state;
    let isValid = true; 
  
    if (name === "") {
      this.setState({ errorName: "*required" });
      isValid = false; 
    } else {
      this.setState({ errorName: "" });
    }
  
    if (email === "") {
      this.setState({ errorEmail: "*required" });
      isValid = false; 
    } else {
      this.setState({ errorEmail: "" });
    }
  
    if (isValid) {
      this.setState({ formSubmitted: true, errorForm: ""},this.updateLeaderBoard);
    } else {
      
      this.setState({ formSubmitted: false});
    }
    
  };
  


  onChangeName = (event) => {
    const { value } = event.target;
  
    // Checking if the value is empty
    if (value === "") {
      this.setState({name: value, errorName: "*required" });
      console.log("empty")
    } else {
      this.setState({ name: value, errorName: "" });
    }
  };
  

    onChangeEmail= event => {
        if(event.target.value === ""){
            this.setState({errorEmail: "*required"})
        }
        else{
            this.setState({errorEmail: ""})
        }
        this.setState({
          email: event.target.value,
        })
        
      }

      onChangeLevel= event => {
        this.setState({
          level: event.target.value,
        })
      }

      playAgain = () => { 
        this.setState(initialState)
        this.randomColorGenerator()
        
      }

    render(){
       const {errorForm,color,score,seconds,resultText,gameFinished,name,email,level,errorName,errorEmail,leaderBoard,formSubmitted} = this.state 
        return(
            <div className = "main-div">
            <div className = "first-container"> 
            <div className="form-container">
              <h1>User Details</h1>
      <form onSubmit= {this.userDetails}>
        <div className="mb-3">
          <label htmlFor="name">Name</label>
          <input onChange={this.onChangeName} type="text" className="form-control" id="name" value = {name}/>
          <p id="nameErrMsg" className="error-message">{errorName}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="email">Email</label>
          <input onChange={this.onChangeEmail} type="text" className="form-control" id="email" value ={email}/>
          <p id="emailErrMsg" className="error-message">{errorEmail}</p>
        </div>
        <div className="mb-3">
          <label htmlFor="level">Difficulty Level</label>
          <select onChange={this.onChangeLevel} id="level" className="form-control" value={level}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button className="btn btn-primary" type = "submit">Submit</button>
      </form>
      {formSubmitted ? <p className = "success-submit mt-2">Sucessfully submitted! You can start the game</p>: ""}
             </div>
             <div className = "game-container">
                <div className = "game-text-container">
                    <p>score: {score}</p>
                    <p>Timer: 00:{seconds}</p>
                </div>
                <div id = {color} onClick={this.onClickBox} className = {`random-color-box ${color}`}>
                </div>
                {gameFinished ? <button onClick = {this.playAgain} className = "btn btn-primary mt-4">Play Again</button> :  <button onClick = {this.randomColorGenerator} className = "btn btn-primary mt-4">Start Game</button>}
              
               <div>
                 <p className = "result-text mt-3 text-center">{resultText}</p>
                 <p className = "error-message mt-3">{errorForm}</p>
                
               </div>
             </div>
             </div>
             <div className = "table-container">
                <h3 className = "text-center">LeaderBoard</h3>
               
         
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>email</th>
                  <th>Score</th>
                  <th>Level</th>
                </tr>
              </thead>
              {gameFinished && <tbody>
                {leaderBoard.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.name}</td>
                    <td>{entry.email}</td>
                    <td>{score}</td>
                    <td>{entry.level}</td>
                  </tr>
                ))}
              </tbody>}
              
            </table>
          
        
                
             </div>
            </div>
          
        )
    }
}

export default GreenLightRedLight;

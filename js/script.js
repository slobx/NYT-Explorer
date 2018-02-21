class App extends React.Component {
    
    render(){
        return(
            <DateChooser/>
        )
    }
}

class DateChooser extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            inputValue: '',
            data: []
        };
        this.getArticles = this.getArticles.bind(this);
        this.setData = this.setData.bind(this);
    }

    updateInputValue(evt) {
        this.setState({
            inputValue: evt.target.value
        });        
    } 

    setData(dataToSet){
        this.setState({data: dataToSet});
        console.log(dataToSet);
    }

    getArticles() {
        if(this.state.inputValue !=""){
            const year = this.state.inputValue.slice(0, 4);
            const month = this.state.inputValue.slice(5, 7);
            $.ajax({ 
                type: "GET",
                data: {
                    apikey: "3674ce641aa342e7b8d71ff60e382c11",
                    year: {year},
                    month: {month}
                },
                url: "https://api.nytimes.com/svc/archive/v1/2016/1.json",                
                'success' : this.setData
            }); 
        } else {
            alert('You must choose some month and year');
        }
    }     

    render(){
        return(
        <div>
            <input type="month" onChange={evt => this.updateInputValue(evt)}/>
            <button onClick={this.getArticles}>Click</button>
        </div>
        );
    }

    
}

ReactDOM.render(<App/>, document.getElementById('root'));
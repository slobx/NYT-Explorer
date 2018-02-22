class App extends React.Component {
    state = {
        inputValue: '',
        data: [],
        links: [],
        imageLinks: [],
        titles: [],
        descriptions: []
    };

    setImageData = (receivedData) => {

        var imgLinks = this.state.imageLinks.slice();
        var titles = this.state.titles.slice();
        var descriptions = this.state.descriptions.slice();
        imgLinks.push(receivedData.image);
        titles.push(receivedData.title);
        descriptions.push(receivedData.description);

        this.setState({imageLinks: imgLinks});
        this.setState({titles: titles});
        this.setState({descriptions: descriptions});
    }

    setData = (dataToSet) => {
        this.setState({data: dataToSet});
        let linksArray = [];
        this.state.data.response.docs.slice(0, 20).map((data) => {
            linksArray.push(data.web_url);
        });
        this.setState({links: linksArray});
        this.setState({imageLinks: []});
        this.setState({titles: []});
        this.setState({descriptions: []});

        this.state.links.map((link) => {
            $.ajax({
                url: "https://api.linkpreview.net/",
                data: {
                    key: "5a8c58db7b541ec5a50920b8900aff7c3dc36593b38f3",
                    q: link
                },
                dataType: 'jsonp',
                success: this.setImageData
            });
        })
    }

    updateInputValue = (evt) => {
        this.setState({
            inputValue: evt.target.value
        });
    }


    render() {
        return (
            <div className="wrapper">
                <DateChooser inputChange={this.updateInputValue} articleClick={this.getArticles}/>
                <GridLayout images={this.state.imageLinks} titles={this.state.titles} descriptions = {this.state.descriptions}/>
            </div>
        )
    }

    getArticles = () => {
        if (this.state.inputValue) {
            const year = this.state.inputValue.slice(0, 4);
            const month = this.state.inputValue.slice(5, 7).replace(/^0+/, '');
            const url = "https://api.nytimes.com/svc/archive/v1/" + year + "/" + month + ".json"
            $.ajax({
                type: "GET",
                data: {
                    apikey: "3674ce641aa342e7b8d71ff60e382c11"
                },
                url: url,
                'success': this.setData
            });
        } else {
            alert('You must choose some month and year');
        }
    }
}

const DateChooser = (props) => {

    return (
        <div>
            <input type="month" onChange={evt => props.inputChange(evt)}/>
            <button onClick={props.articleClick}>Click to get articles</button>
        </div>

    );

}

class GridLayout extends React.Component {

    render() {
        var images = this.props.images;
        var titles = this.props.titles;
        var descriptions = this.props.descriptions;

        return (
            <div className="wrapper">
                <div className="flex-grid">
                    {
                        Object.keys(images).map((image, i) => {
                            return (<Row img={images[image]} title={titles[image]} description={descriptions[image]} key={i}> </Row>)
                        })

                    }
                </div>
            </div>
        )
    }
}

const Row = (props) => (
    <div className="col">
        <p className="titleP">{props.title}</p>
        <img src={props.img}/>
        <p>{props.description}</p>
    </div>
)


ReactDOM.render(<App/>, document.getElementById('root'));
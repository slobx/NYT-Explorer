class App extends React.Component {
    state = {
        inputValue: '',
        data: [],
        links: [],
        imageLinks: [],
        titles: [],
        descriptions: [],
        // articleDetailsData: '',
        // articleDetailsHtml: []
        //TODO fix ArticleDetails
    };

    setArticleDetailsData = (receivedData) => {
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

    setArticleApiData = (dataToSet) => {
        console.log(dataToSet);
        this.setState({data: dataToSet});
        let linksArray = [];
        this.state.data.response.docs.slice(0, 1).map((data) => {
            linksArray.push(data.web_url);
        });
        this.setState({links: linksArray});

        //deleting all data = to render new one - prevents duplicating
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
                success: this.setArticleDetailsData
            });
        })
    }

    updateInputValue = (evt) => {
        this.setState({
            inputValue: evt.target.value
        });
    }

    articleClicked =(evt, i) => {
        evt.currentTarget.style.backgroundColor = 'white';
        let aDoc = this.state.data.response.docs[i];
        // let aDocDetails = JSON.stringify(aDoc);
        console.log(aDoc);
        this.setState({articleDetailsData: aDoc});
        console.log(this.state.articleDetailsData);
        //TODO fix ArticleDetails
    }

    render() {


        return (
            <div className="wrapper">
                <DateChooser inputChange={this.updateInputValue} articleClick={this.getArticles}/>
                <div className="page">
                    <ArticleGrid className="master"
                                 clicked = {this.articleClicked}
                                 images={this.state.imageLinks}
                                 titles={this.state.titles}
                                descriptions={this.state.descriptions}/>

                    //TODO fix ArticleDetails
                    <ArticleDetails headline = {this.state.articleDetailsData.headline}
                                    author = {this.state.articleDetailsData.byline.original}
                                    keywords = {this.state.articleDetailsData.keywords.value}
                                    pub_date = {this.state.articleDetailsData.pub_date}
                                    section = {this.state.articleDetailsData.section_name}
                                    word_count = {this.state.articleDetailsData.word_count}/>
                    />
                </div>
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
                'success': this.setArticleApiData
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

class ArticleGrid extends React.Component {
    render() {
        let images = this.props.images;
        let titles = this.props.titles;
        let descriptions = this.props.descriptions;

        return (
            <div className="wrapper">
                <div className="flex-grid">
                    {
                        Object.keys(images).map((index, i) => {
                            return (<ArticlePreview onClick={(evt)=>this.props.clicked(evt, i)} img={images[index]} title={titles[index]}
                                                    description={descriptions[index]}
                                                    key={i}> </ArticlePreview>)
                        })
                    }
                </div>
            </div>
        )
    }
}

const ArticlePreview = (props) => {
    return (
        <div className="col" onClick = {props.onClick}>
            <p className="title_p">{props.title}</p>
            <img src={props.img}/>
            <p>{props.description ? props.description.substring(0, 100) + "..." : props.description}</p>
        </div>
    )
}

const ArticleDetails = (props) => {
    return (
        <div className="details">
            <h2>{props.headline}</h2>
            <h3>{props.author}</h3>
            <p>{props.keywords}</p>
            <p>{props.pub_date}</p>
            <p>{props.section}</p>
            <p>{props.word_count}</p>
        </div>
    );

}

ReactDOM.render(<App/>, document.getElementById('root'));
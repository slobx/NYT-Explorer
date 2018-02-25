class App extends React.Component {

    state = {
        data: [],
        links: [],
        imageLinks: [],
        titles: [],
        descriptions: [],
        articleDetailsData: [],
        clicked_index: ""
    };


    setArticleDetailsData = (receivedData) => {
        $("i").removeClass("fa fa-spinner fa-spin");
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
        //sets received data from NYT to state
        this.setState({data: dataToSet});


        let linksArray = [];
        this.state.data.response.docs.slice(0, 20).map((data) => {
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

    articleClicked = (evt, i) => {
        var modal = document.getElementById('myModal');
        var span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
        }
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }


        this.setState({clicked_index: i});
        let headline = this.state.data.response.docs[i].headline.main;
        let author = this.state.data.response.docs[i].byline.original;
        let pub_date = this.state.data.response.docs[i].pub_date;
        let section = this.state.data.response.docs[i].section_name;
        let word_count = this.state.data.response.docs[i].word_count;
        let web_url = this.state.data.response.docs[i].web_url;
        let aDocDetails = [];
        aDocDetails.push(headline);
        aDocDetails.push(author);
        aDocDetails.push(pub_date);
        aDocDetails.push(section);
        aDocDetails.push(word_count);
        aDocDetails.push(web_url);
        this.setState({articleDetailsData: aDocDetails});
    }

    render() {

        return (
            <div className="container">
                <div className="banner">
                    <DateChooser inputChange={this.updateInputValue} articleClick={this.getArticles}/>
                </div>
                <div className="page">
                    <ArticleGrid className="master"
                                 index={this.state.index}
                                 selected={this.state.selected}
                                 clicked={this.articleClicked}
                                 images={this.state.imageLinks}
                                 titles={this.state.titles}
                                 descriptions={this.state.descriptions}
                                 clicked_index={this.state.clicked_index}/>

                    <ArticleDetails headline={this.state.articleDetailsData[0]}
                                    author={this.state.articleDetailsData[1]}
                                    pub_date={this.state.articleDetailsData[2]}
                                    section={this.state.articleDetailsData[3]}
                                    word_count={this.state.articleDetailsData[4]}
                                    web_url={this.state.articleDetailsData[5]}
                    />
                </div>

            </div>
        )
    }

    getArticles = () => {
        if ($("#search_input").val() && $("#year_selector").val()) {
            $("i").addClass("fa fa-spinner fa-spin");
            this.setState({articleDetailsData: []});
            const year = $("#search_input").val();
            const month = $("#year_selector").val();
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
        <div className="search_wrapper">
            <p className="heading_msg">T H E&nbsp;&nbsp;N E W&nbsp;&nbsp;Y O R K&nbsp;&nbsp;T I M E S</p>
            <p className="heading_msg">E X P L O R E R</p>
            <div className="dropdown-buttons">
                <div className="dropdown-button">
                    <select id="year_selector">
                        <option value="1">January</option>
                        <option value="2">February</option>
                        <option value="3">March</option>
                        <option value="4">April</option>
                        <option value="5">May</option>
                        <option value="6">June</option>
                        <option value="7">July</option>
                        <option value="8">August</option>
                        <option value="9">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>
                <div className="dropdown-input">
                    <input className="search_input" id="search_input" type="number" min="1851" max="2018" maxLength="4"
                           minLength="4"
                           placeholder="e.g. 1999"/>
                </div>
            </div>
            <div className="button_wrapper">
                <button className="search_btn" id="search_btn" onClick={props.articleClick}>
                    <i></i>&nbsp; Click to get articles
                </button>
            </div>
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
                            return (<ArticlePreview isClicked={i === this.props.clicked_index}
                                                    onClick={(evt) => this.props.clicked(evt, i)}
                                                    img={images[index]}
                                                    title={titles[index]}
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
        <div className={`col ${props.isClicked ? 'red' : 'white'}`} onClick={props.onClick}>
            <p className="title_p">{props.title}</p>
            <img src={props.img}/>
            <p className="text_p">{props.description ? props.description.substring(0, 100) + "..." : props.description}</p>
        </div>
    )
}

const ArticleDetails = (props) => {
    return (
        <div id="myModal" className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <span className="close">&times;</span>
                    <p>{props.headline}</p>
                </div>
                <div className="modal-body">
                    <p>Section: {props.section}</p>
                    <p>Word count: {props.word_count}</p>
                    <p>Author: {props.author}</p>
                    <p>Publication date: {props.pub_date}</p>
                    <button className="read_more_btn"><a target="_blank" href={props.web_url}>Read more</a></button>
                </div>

                <div className="modal-footer">

                </div>
            </div>

        </div>
    );

}


ReactDOM.render(<App/>, document.getElementById('root'));
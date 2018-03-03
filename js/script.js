/**
 * @param response.docs
 * @param web_url
 * @param docs.byline
 * @param docs.byline.original
 * @param docs.pub_date
 * @param docs.section_name
 * @param docs.word_count
 * @param receivedData.description
 */

class App extends React.Component {

    state = {
        data: [],
        receivedData: [],
        links: [],
        imageLinks: [],
        titles: [],
        descriptions: [],
        articleDetailsData: [],
        clicked_index: ""
    };


    setArticleDetailsData = (receivedData) => {

        //enables the button after success response from API and removes spinner
        $("#search_btn").prop("disabled", false).text("CLICK TO GET ARTICLES");

        //sets image,title and descriptions from link preview API to ArticlePreview
        let data = [];
        data.push(...this.state.receivedData);
        data.push(receivedData);
        this.setState({receivedData: data});

        let imgLinks = [];
        imgLinks.push(...this.state.imageLinks);
        let titles = [];
        titles.push(...this.state.titles);
        let descriptions = [];
        descriptions.push(...this.state.descriptions);

        imgLinks.push(receivedData.image);
        titles.push(receivedData.title);
        descriptions.push(receivedData.description);

        this.setState({imageLinks: imgLinks});
        this.setState({titles: titles});
        this.setState({descriptions: descriptions});
    }

    setArticleApiData = (dataToSet) => {
        //sets received data from NYT to state
        this.setState({data: dataToSet});
        let linksArray = [];
        this.setState({links: linksArray});
        this.state.data.response.docs.slice(0, 20).map((data) => {
            linksArray.push(data.web_url);
        });
        this.setState({links: linksArray});
        linksArray.map((link) => {
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
        //opens modal dialog when article is clicked
        this.setState({clicked_index: i});
        let modal = document.getElementById('myModal');
        let span = document.getElementsByClassName("close")[0];
        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
        };
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };

        //fetch data for modal dialog
        let headline = this.state.data.response.docs[i].headline.main;
        let author = this.state.data.response.docs[i].byline ? this.state.data.response.docs[i].byline.original : "";
        let pub_date = this.state.data.response.docs[i].pub_date;
        let section = this.state.data.response.docs[i].section_name;
        let word_count = this.state.data.response.docs[i].word_count;
        let web_url = this.state.data.response.docs[i].web_url;
        let aDocDetails = [];
        this.setState({articleDetailsData: aDocDetails});
        aDocDetails.push(headline);
        aDocDetails.push(author);
        aDocDetails.push(pub_date);
        aDocDetails.push(section);
        aDocDetails.push(word_count);
        aDocDetails.push(web_url);
        this.setState({articleDetailsData: aDocDetails});
    };

    getArticles = () => {
        this.setState({titles: []});
        this.setState({links: []});
        this.setState({imageLinks: []});
        this.setState({titles: []});
        this.setState({descriptions: []});

        //checks if user entered correct data
        //noinspection JSJQueryEfficiency
        if ($("#search_input").val() && $("#year_selector").val()) {

            //prevents rage click and loads spinner
            $("#search_btn").prop("disabled", true).html('<i class="fa fa-spinner fa-spin"></i> &nbsp;PLEASE WAIT...');
            //noinspection JSJQueryEfficiency
            $('#search_input').attr('placeholder', 'e.g. 1999').css('border', '1px solid #635656');

            //fetch user entries and pass it to NYT API
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
            //gives message to the user if user do not enter year
            $('#search_input').attr('placeholder', 'Choose year...').css('border', '1px solid #1ABC9C');
        }

    };

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
}

class DateChooser extends React.Component {

    handleChange = () => {
        //gives message to the user if user do not enter year between 1851-2018
        //noinspection JSJQueryEfficiency
        if ($('#search_input').val() < 1851 || $('#search_input').val() > 2018) {
            $('#errorMsg').text("Enter year from 1851 to 2018");
            $("#search_btn").prop("disabled", true).css('color', '#C0C0C0');
        }
        else {
            $('#errorMsg').text("");
            $("#search_btn").prop("disabled", false).css('color', 'white');
            $('#search_input').css('border', '1px solid #635656');
        }
    };

    render() {
        return (
            <div className="search_wrapper">
                <p className="heading_msg">T H E&nbsp;&nbsp;B I G&nbsp;&nbsp;A P P L E&nbsp;&nbsp;N E W S</p>
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
                        <input className="search_input" id="search_input" type="number" min="1851" max="2018"
                               maxLength="4"
                               message="Enter year from 1851 to 2018"
                               minLength="4"
                               placeholder="e.g. 1999"
                               onChange={(e) => {
                                   this.handleChange(e)
                               }}/>
                        <span id="errorMsg" value={""}/>

                    </div>
                </div>

                <div className="button_wrapper">
                    <button className="search_btn" id="search_btn" onClick={this.props.articleClick}>
                        <i/>&nbsp; Click to get articles
                    </button>
                </div>
            </div>
        );
    }


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
                        titles.map((title, i) => {
                            return (<ArticlePreview isClicked={i === this.props.clicked_index}
                                                    onClick={(evt) => this.props.clicked(evt, i)}
                                                    img={images[i]}
                                                    title={titles[i]}
                                                    description={descriptions[i]}
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
            <p className="text_p">{props.description ? props.description.substring(0, 75) + "..." : props.description}</p>
        </div>
    )
};

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

            </div>

        </div>
    );

};

ReactDOM.render(<App/>, document.getElementById('root'));
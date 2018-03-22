import React, { Component } from 'react';
import $ from 'jquery';

import logo from './logo.svg';
import './App.css';
import '../../style.css'
import 'font-awesome/css/font-awesome.min.css';

import DateChooser from '../DateChooser/DateChooser'
import ArticleGrid, {ArticlePreview, ArticleDetails} from '../ArticleGrid/ArticleGrid'


class App extends Component {
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

export default App;

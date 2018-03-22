import React, {Component} from 'react';
import $ from 'jquery';

class DateChooser extends Component {

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

export default DateChooser;
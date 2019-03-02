$(document).ready(function () {

    const switching_time = 1000; //time in seconds
    let api_url = "http://localhost:8080/api/screen/schedule";

    let last_fetched = [];

    function switch_language(identifier,lang_list){
        if(typeof lang_list !== 'undefined') {
            $(identifier).html(lang_list[0]);

            setTimeout(function () {
                $(identifier).html(lang_list[1]);
            }, switching_time);

            setTimeout(function () {
                $(identifier).html(lang_list[2]);
            }, switching_time*2);
        }
    }

    function get_schedule_from_server(api_url) {
        $.ajax({
            type: "GET",
            url: api_url,
            dataType: 'json', // json method
            success: function (response) { // If success
                last_fetched = response;
            },
            error: function (response) { // If success
                console.log('error loading at ', new Date($.now()));
            }
        });
    }

    function update_date(current_date) {
        $('.header-clock').html(current_date);
    }

    function update_title(title) {
        switch_language('.header-title',title);
    }

    function update_table_headers(table_headers){
        if(typeof table_headers !== 'undefined') {
            switch_language('#header-time', [table_headers[0][0], table_headers[1][0], table_headers[2][0]]);
            switch_language('#header-destination', [table_headers[0][1], table_headers[1][1], table_headers[2][1]]);
            switch_language('#header-route', [table_headers[0][2], table_headers[1][2], table_headers[2][2]]);
            switch_language('#header-status', [table_headers[0][3], table_headers[1][3], table_headers[2][3]]);
        }
    // <td id="header-time">TIME</td>
    //         <td id="header-destination">DESTINATION</td>
    //         <td id="header-route">ROUTE</td>
    //         <td id="header-status">STATUS</td>
    //         <td id="header-remarks">REMARKS</td>
    }

    function update_table(screen_rows) {
        clear_data_fields();

        for (let i = 0; i < screen_rows.length; i++) {
            let screen_row = screen_rows[i];
            let table_row = $('#row-' + (i + 1));

            table_row.removeClass();
            table_row.addClass(screen_row['status']);

            $('.time-' + (i + 1)).html(screen_row['time']);
            $('.destination-' + (i + 1)).html(screen_row['destination']);
            $('.route-' + (i + 1)).html(screen_row['route']);
            $('.remarks-' + (i + 1)).html(screen_row['remarks']);
            $('.status-' + (i + 1)).html(screen_row['status']);
        }

    }

    function clear_data_fields() {
        $('.data-field').html("");
    }

    function refresh_content(){
        get_schedule_from_server(api_url);
        update_date(last_fetched['currentDate']);
        update_title(last_fetched['screenTitle']);
        update_table_headers(last_fetched['tableHeaders']);
        // update_table(last_fetched['screenRows']);
    }

    refresh_content();

    self.setInterval(function () {
        refresh_content()
    }, switching_time*3);

});

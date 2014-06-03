/** @jsx React.DOM */
var React = require('react'),
    Select;

Select = React.createClass({
    handleOnChange: function(event) {
        var items = this.props.items
        for (var i=0; i<items.length; i++) {
            var item = items[i];
            if (item.name == event.target.value) {
                this.props.onChange(item);
                return;
            }
        }
        this.props.onChange(null);
    },
    selectItem: function(event) {
        this.props.onChange(null);
    },
    render: function () {
        var options = this.props.items.map(function(item) {
            return <option key={item["@id"]} value={item.name}>{item.name}</option>
        });
        var value = "";
        if (this.props.item != null) {
            value = this.props.item.name;
        }
        var content = null;
        if (this.props.item == null) {
            content = <form className="form" role="form">
                        <select id="item" className="form-control" value={value} onChange={this.handleOnChange}>
                          <option value="--">select a {this.props.type}</option>
                          {options}
                        </select>
                      </form>;
        } else {
            content = <button type="button" className="btn btn-default navbar-btn" onClick={this.selectItem}>{this.props.item.name}</button>;
        }
        return content;
    }

});

module.exports = Select;

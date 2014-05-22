/** @jsx React.DOM */
var React = require('react'),
    Bags;

Bags = React.createClass({
    handleOnChange: function(event) {
        var bags = this.props.bags
        for (var i=0; i<bags.length; i++) {
            var bag = bags[i];
            if (bag["@id"] == event.target.value) {
                this.props.onChange(bag);
            }
        }
    },
    
    render: function () {
        var options = this.props.bags.map(function(bag) {
            return <option key={bag["@id"]} value={bag["@id"]}>{bag.name}</option>
        });
        return <select id="bag" className="form-control" value={this.props.bag} onChange={this.handleOnChange}>
                 {options}
               </select>;
    }

});

module.exports = Bags;

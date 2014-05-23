/** @jsx React.DOM */
var React = require('react'),
    Breadcrumbs;

Breadcrumbs = React.createClass({
    render: function () {
        var crumbs = [];
        crumbs.push("home");
        if (this.props.project) {
            crumbs.push(this.props.project.name)
        }
        if (this.props.bag) {
            crumbs.push(this.props.bag.name)
        }
        var i = this.props.files.indexOf(this.props.file);        
        if (this.props.file) {
            crumbs.push(i+1);
        }
        var breadcrumbs_items = crumbs.map(function(name) {
            return <li key={name} value={name}>{name}</li>
        });

        return <ol className="breadcrumb">
                 {breadcrumbs_items}
        </ol>;
    }
});

module.exports = Breadcrumbs;

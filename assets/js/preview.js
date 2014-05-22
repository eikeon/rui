/** @jsx React.DOM */
var React = require('react'),
    Preview;

Preview = React.createClass({
    getInitialState: function () {
        return {n: 0};
    },
    handleResize: function(e) {
        this.computeN();
    },
    componentDidMount: function() {
        this.computeN();
        window.addEventListener('resize', this.handleResize);
    },
    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
    },
    componentDidUpdate: function(prevProps, prevState) {
        this.computeN()
    },
    computeN: function() {
        var node = this.getDOMNode();
        if (node) {
            var n = Math.floor(((node.offsetWidth / 200) - 1) / 2);
            if (this.state.n != n) {
                this.setState({n: n});
            }
        }
    },
    render: function () {
        if (this.props.file) {
            var files = [];
            var i = this.props.files.indexOf(this.props.file);
            var n = this.state.n;
            for (var j=-n; files.length<2*n+1; j++) {
                if (i+j<0) {
                    continue;
                }
                if (i+j>=this.props.files.length) {
                    break;
                }
                var img = this.props.files[i+j].image_small;
                files.push(<div key={img} className={j==0 ? 'image current' : 'image'} ><img src={img}></img></div>);
            }
            return <div className="preview" ref="preview">
                     {files}
                   </div>;
        } else {
            return <div><p>...</p></div>;
        }
    }
});

module.exports = Preview;

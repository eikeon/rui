/** @jsx React.DOM */
var React = require('react'),
    Projects;

Projects = React.createClass({
    handleOnChange: function(event) {
        var projects = this.props.projects
        for (var i=0; i<projects.length; i++) {
            var project = projects[i];
            if (project.name == event.target.value) {
                this.props.onChange(project);
            }
        }
    },
    
    render: function () {
        var options = this.props.projects.map(function(project) {
            return <option value={project.name}>{project.name}</option>
        });
        return <select id="project" className="form-control" value={this.props.project} onChange={this.handleOnChange}>
                 <option value="--">select a project</option>
                 {options}
               </select>;
    }

});

module.exports = Projects;

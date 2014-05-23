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
                return;
            }
        }
        this.props.onChange(null);
    },
    
    render: function () {
        var options = this.props.projects.map(function(project) {
            return <option key={project.name} value={project.name}>{project.name}</option>
        });
        var value = "";
        if (this.props.project != null) {
            value = this.props.project.name;
        }
        return <select id="project" className="form-control" value={value} onChange={this.handleOnChange}>
                 <option value="--">select a project</option>
                 {options}
               </select>;
    }

});

module.exports = Projects;

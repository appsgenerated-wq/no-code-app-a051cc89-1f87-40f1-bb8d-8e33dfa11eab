import React, { useState, useEffect, useCallback } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProject, setNewProject] = useState({ title: '', description: '', projectUrl: '', coverImage: null });

  const loadProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await manifest.from('Project').find({ 
        filter: { ownerId: user.id },
        sort: { createdAt: 'desc' }
      });
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [manifest, user.id]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.title || !newProject.coverImage) {
      alert('Title and Cover Image are required.');
      return;
    }
    try {
      const createdProject = await manifest.from('Project').create(newProject);
      setProjects([createdProject, ...projects]);
      setNewProject({ title: '', description: '', projectUrl: '', coverImage: null });
      e.target.reset();
    } catch (err) {
      alert('Failed to create project.');
      console.error(err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
        try {
            await manifest.from('Project').delete(projectId);
            setProjects(projects.filter(p => p.id !== projectId));
        } catch (err) {
            alert('Failed to delete project.');
            console.error(err);
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}!</h1>
          <div className="flex items-center space-x-4">
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Admin Panel
            </a>
            <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Add a New Project</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <input type="text" placeholder="Project Title" onChange={(e) => setNewProject({...newProject, title: e.target.value})} className="w-full p-2 border rounded-md" required />
            <textarea placeholder="Description" onChange={(e) => setNewProject({...newProject, description: e.target.value})} className="w-full p-2 border rounded-md" rows="3"></textarea>
            <input type="url" placeholder="https://example.com" onChange={(e) => setNewProject({...newProject, projectUrl: e.target.value})} className="w-full p-2 border rounded-md" />
            <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Cover Image</label>
                <input type="file" onChange={(e) => setNewProject({...newProject, coverImage: e.target.files[0]})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Create Project</button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Projects</h2>
          {isLoading ? <p>Loading projects...</p> : error ? <p className='text-red-500'>{error}</p> : projects.length === 0 ? (
            <p className="text-gray-500">You haven't added any projects yet. Use the form above to get started!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project.id} className="border rounded-lg overflow-hidden shadow-md bg-white flex flex-col">
                  {project.coverImage && <img src={project.coverImage.url} alt={project.title} className="w-full h-48 object-cover" />}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-lg text-gray-900">{project.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 flex-grow">{project.description}</p>
                    {project.projectUrl && <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mt-2 text-sm font-semibold">View Project</a>}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <button onClick={() => handleDeleteProject(project.id)} className='text-xs text-red-500 hover:text-red-700 font-medium'>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;

import './Dashboard.css';
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
//tabs (home, profile)
const Dashboard = ({ onLogout, onShowAuth }) => {
    const [activeTab, setActiveTab] = useState('home');
    const { currentUser, userProfile } = useAuth();

    const tabs = [
        { id: 'home', label: 'Home' },
        { id: 'profile', label: 'Profile' }
    ]

    const handleTabClick = (tabId) => {
        const tab = tabs.find(t => t.id === tabId);
        setActiveTab(tabId);
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <div>Home</div>
                );
            
            case 'profile':
                console.log(userProfile.createdAt.seconds);
                return (
                    <div className='tab-content'>
                        <h2>My Profile</h2>
                        <div className='profile-container'>
                            <div className='profile-img'>
                                <img
                                    src={userProfile?.photoURL || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23d32f2f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E"}
                                    alt='Profile Photo'
                                />
                            </div>
                            <div className='profile-info'>
                                <h3 className='user-name'>{userProfile?.displayName || 'User'}</h3>
                                <div className='user-created'>Account Created At: {new Date(userProfile?.createdAt.seconds*1000).toString() || 'nan'}</div>
                                <div className='user-lms'>Not linked to a LMS</div>
                            </div>
                        </div>
                    </div>
                );
            
            default:
                return null;
        }
    }
    return (
        <div className='dashboard'>
            <div className='dashboard-content'>
                <div className='dashboard-header'>
                    <div className='header-left'>
                        <h1>Course History App</h1>
                    </div>
                    <button className='logout-btn' onClick={onLogout}>
                        Logout
                    </button>
                </div>
                <div className='tab-navigation'>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab.id)}
                        >
                            <span className='tab-label'>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="tab-container">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
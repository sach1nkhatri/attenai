import React, { useState } from 'react';
import "../css/settings.css"
const Settings = () => {
    const [activeTab, setActiveTab] = useState('account');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="container p-0">
            <h1 className="h3 mb-3">Settings</h1>

            <div className="row">
                <div className="col-md-5 col-xl-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Profile Settings</h5>
                        </div>

                        <div className="list-group list-group-flush" role="tablist">
                            <a
                                className={`list-group-item list-group-item-action ${activeTab === 'account' ? 'active' : ''}`}
                                onClick={() => handleTabClick('account')}
                                role="tab"
                            >
                                Account
                            </a>
                            <a
                                className={`list-group-item list-group-item-action ${activeTab === 'password' ? 'active' : ''}`}
                                onClick={() => handleTabClick('password')}
                                role="tab"
                            >
                                Password
                            </a>
                            <a className="list-group-item list-group-item-action" href="#" role="tab">
                                Privacy and safety
                            </a>
                            <a className="list-group-item list-group-item-action" href="#" role="tab">
                                Email notifications
                            </a>
                            <a className="list-group-item list-group-item-action" href="#" role="tab">
                                Web notifications
                            </a>
                            <a className="list-group-item list-group-item-action" href="#" role="tab">
                                Widgets
                            </a>
                            <a className="list-group-item list-group-item-action" href="#" role="tab">
                                Your data
                            </a>
                            <a className="list-group-item list-group-item-action" href="#" role="tab">
                                Delete account
                            </a>
                        </div>
                    </div>
                </div>

                <div className="col-md-7 col-xl-8">
                    <div className="tab-content">
                        {activeTab === 'account' && (
                            <div className="tab-pane fade show active" role="tabpanel">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-actions float-right">
                                            <div className="dropdown show">
                                                <a href="#" data-toggle="dropdown" data-display="static">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="feather feather-more-horizontal align-middle"
                                                    >
                                                        <circle cx="12" cy="12" r="1"></circle>
                                                        <circle cx="19" cy="12" r="1"></circle>
                                                        <circle cx="5" cy="12" r="1"></circle>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        <h5 className="card-title mb-0">Public info</h5>
                                    </div>
                                    <div className="card-body">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="form-group">
                                                        <label htmlFor="inputUsername">Username</label>
                                                        <input type="text" className="form-control" id="inputUsername" placeholder="Username" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="inputBio">Biography</label>
                                                        <textarea
                                                            rows="2"
                                                            className="form-control"
                                                            id="inputBio"
                                                            placeholder="Tell something about yourself"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="text-center">
                                                        <img
                                                            alt="Andrew Jones"
                                                            src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                                            className="rounded-circle img-responsive mt-2"
                                                            width="128"
                                                            height="128"
                                                        />
                                                        <div className="mt-2">
                              <span className="btn btn-primary">
                                <svg
                                    className="svg-inline--fa fa-upload fa-w-16"
                                    aria-hidden="true"
                                    data-prefix="fas"
                                    data-icon="upload"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                >
                                  <path
                                      fill="currentColor"
                                      d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                                  ></path>
                                </svg>
                                Upload
                              </span>
                                                        </div>
                                                        <small>For best results, use an image at least 128px by 128px in .jpg format</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <button type="submit" className="btn btn-primary">
                                                Save changes
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-actions float-right">
                                            <div className="dropdown show">
                                                <a href="#" data-toggle="dropdown" data-display="static">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="feather feather-more-horizontal align-middle"
                                                    >
                                                        <circle cx="12" cy="12" r="1"></circle>
                                                        <circle cx="19" cy="12" r="1"></circle>
                                                        <circle cx="5" cy="12" r="1"></circle>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        <h5 className="card-title mb-0">Private info</h5>
                                    </div>
                                    <div className="card-body">
                                        <form>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="inputFirstName">First name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="inputFirstName"
                                                        placeholder="First name"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="inputLastName">Last name</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="inputLastName"
                                                        placeholder="Last name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputEmail4">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="inputEmail4"
                                                    placeholder="Email"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputAddress">Address</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="inputAddress"
                                                    placeholder="1234 Main St"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputAddress2">Address 2</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="inputAddress2"
                                                    placeholder="Apartment, studio, or floor"
                                                />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="inputCity">City</label>
                                                    <input type="text" className="form-control" id="inputCity" />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="inputState">State</label>
                                                    <select id="inputState" className="form-control">
                                                        <option selected>Choose...</option>
                                                        <option>...</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="inputZip">Zip</label>
                                                    <input type="text" className="form-control" id="inputZip" />
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-primary">
                                                Save changes
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'password' && (
                            <div className="tab-pane fade" role="tabpanel">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Password</h5>

                                        <form>
                                            <div className="form-group">
                                                <label htmlFor="inputPasswordCurrent">Current password</label>
                                                <input type="password" className="form-control" id="inputPasswordCurrent" />
                                                <small>
                                                    <a href="#">Forgot your password?</a>
                                                </small>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputPasswordNew">New password</label>
                                                <input type="password" className="form-control" id="inputPasswordNew" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="inputPasswordNew2">Verify password</label>
                                                <input type="password" className="form-control" id="inputPasswordNew2" />
                                            </div>
                                            <button type="submit" className="btn btn-primary">
                                                Save changes
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

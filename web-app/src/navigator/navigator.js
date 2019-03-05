import React, {Component} from 'react';
import {connect} from 'react-redux'
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

import AuthenticationPanel from '../authentication/authentication'
import MediaPanel from '../media/media';
import MediaRemote from '../remote-control/remote-control';
import ChickenRemote from '../chicken-control/chicken-controls';
import Icons from '../icons/icons';
import News from '../news/news';
import Welcome from '../welcome/welcome';
import Loyalty from '../loyalty/loyalty';
import settingsPanelFor from '../settings-panel/settings-panel';
import actions from './navigation-actions';

import styles from './navigator.module.scss';
import posed, {PoseGroup} from 'react-pose';

const RoutesContainer = posed.div({
    enter: {
        opacity: 1,
        delay: 300,
        beforeChildren: true
    },
    exit: {opacity: 0}
});

const authentication = () => <AuthenticationPanel/>;
const media = () => <MediaPanel/>;
const mediaRemote = () => <MediaRemote/>;
const chickenControls = () => <ChickenRemote/>;
const icons = () => <Icons/>;
const welcome = () => <Welcome/>;
const news = () => <News/>;
const loyalty = () => <Loyalty/>;

const permissionsFieldSet = {
    label: 'Permissions', id: 'permissions', fields: [
        {id: 'simpleCommands', label: 'SimpleCommands (No !)', type: 'checkbox'},
        {id: 'allowNormalUsers', label: 'Allow Normal Users', type: 'checkbox'},
        {id: 'allowVips', label: 'Allow Vips', type: 'checkbox'},
        {id: 'allowModerators', label: 'Allow Moderators', type: 'checkbox'},
        {id: 'allowSubscribersMembers', label: 'Allow Subscribers/Members', type: 'checkbox'}
    ]
};
const customSourceFieldSet = {fields: []};
const cooldownFieldSet = {fields: []};
const quizOptionsFieldSet = {
    label: 'Quiz', id: 'options', fields: [
        {
            id: 'intervalInMinutes',
            label: 'Interval Between Quizzes (minutes)',
            type: 'number'
        },
        {
            id: 'defaultPowerReward',
            label: 'Default Power Reward',
            type: 'number'
        },
        {
            id: 'defaultLoveReward',
            label: 'Default Love Reward',
            type: 'number'
        },
        {
            id: 'questions',
            label: 'Questions',
            type: 'array',
            fields: [
                {
                    id: 'question',
                    label: 'Question',
                    type: 'text'
                },
                {
                    id: 'answers',
                    label: 'Answers, separate with comma',
                    type: 'text'
                },
                {
                    id: 'reward',
                    label: 'Reward in points',
                    type: 'number'
                },
                {
                    id: 'rewardCurrency',
                    label: 'Reward Currency if applicable (love, power)',
                    type: 'text'
                }
            ]
        }
    ]
};
const questionFields = [
    permissionsFieldSet,
    cooldownFieldSet,
    customSourceFieldSet,
    quizOptionsFieldSet
];
const quiz = settingsPanelFor('quiz', questionFields);

// const test = <TestComponent/>;

class Navigator extends Component {
    constructor(props) {
        super(props);
        this.state = {showSettings: false};
    }

    render() {
        return (
            <Router>
                <Route
                    render={({location}) => (
                        <div className={styles.navigator}>
                            <div className={styles.viewPicker}>
                                <Link
                                    className={styles.navigationItem + ' ' + (Navigator.isSelected(location, '/') ? styles.selected : '')}
                                    to="/">
                                    <div>
                                        <span role="img">🌍 Connection</span>
                                    </div>
                                </Link>
                                <Link
                                    className={styles.navigationItem + ' ' + (Navigator.isSelected(location, '/remote') ? styles.selected : '')}
                                    to="/remote">
                                    <div>
                                        <span role="img" aria-label={"remote"}>📱 Remote</span>
                                    </div>
                                </Link>
                                <div className={styles.navigationItem + ' ' + styles.settingsMenu}
                                     onMouseEnter={() => {
                                         this.setState({showSettings: true})
                                     }}
                                     onMouseLeave={() => {
                                         this.setState({showSettings: false})
                                     }}
                                >

                                    <span role="img" aria-label={"settings"}>⚙ Settings</span>
                                    <div
                                        className={this.state.showSettings ? styles.settings : styles.settings + ' ' + styles.hidden}>
                                        <Link
                                            className={styles.navigationItem + ' ' + (Navigator.isSelected(location, '/media-controls') ? styles.selected : '')}
                                            to="/media-controls">
                                            <div>
                                                <span role="img" aria-label={"tv"}>📺 Media</span>
                                            </div>
                                        </Link>
                                        <Link
                                            className={styles.navigationItem + ' ' + (Navigator.isSelected(location, '/chicken') ? styles.selected : '')}
                                            to="/chicken">
                                            <div>
                                                <span role="img" aria-label={"chicken"}>🐔 Chicken</span>
                                            </div>
                                        </Link>
                                        <Link
                                            className={styles.navigationItem + ' ' + (Navigator.isSelected(location, '/icons') ? styles.selected : '')}
                                            to="/icons">
                                            <div>
                                                <span role="img" aria-label={"chicken"}>😀 Icons</span>
                                            </div>
                                        </Link>
                                        <Link
                                            className={styles.navigationItem + ' ' + (Navigator.isSelected(location, '/welcome') ? styles.selected : '')}
                                            to="/welcome">
                                            <div>
                                                <span role="img" aria-label={"welcome"}>🙋‍ Welcome</span>
                                            </div>
                                        </Link>
                                        <Link
                                            className={styles.navigationItem + ' ' + (Navigator.isSelected(location, '/news') ? styles.selected : '')}
                                            to="/news">
                                            <div>
                                                <span role="img">📰 News</span>
                                            </div>
                                        </Link>
                                        <Link
                                            className={styles.navigationItem + ' ' + (Navigator.isSelected(location, '/loyalty') ? styles.selected : '')}
                                            to="/loyalty">
                                            <div>
                                                <span role="img">🥇 Loyalty</span>
                                            </div>
                                        </Link>
                                        <Link
                                            className={styles.navigationItem + ' ' + (Navigator.isSelected(location, '/questions') ? styles.selected : '')}
                                            to="/quiz">
                                            <div>
                                                <span role="img">🥇 Quiz</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <PoseGroup>
                                <RoutesContainer key={location.pathname}>
                                    <Switch location={location}>
                                        <Route key={'connections'} exact path="/" component={authentication}/>
                                        <Route key={'media-controls'} path="/media-controls/" component={media}/>
                                        <Route key={'remote'} path="/remote/" component={mediaRemote}/>
                                        <Route key={'chicken'} path="/chicken/" component={chickenControls}/>
                                        <Route key={'welcome'} path="/welcome/" component={welcome}/>
                                        <Route key={'icons'} path="/icons/" component={icons}/>
                                        <Route key={'news'} path="/news/" component={news}/>
                                        <Route key={'loyalty'} path="/loyalty/" component={loyalty}/>
                                        <Route key={'quiz'} path={"/quiz/"} component={quiz}/>
                                    </Switch>
                                </RoutesContainer>
                            </PoseGroup>
                        </div>)}/>
            </Router>
        )
    }

    static isSelected(location, url) {
        return location.pathname === url;
    }
}

const mapStateToProps = (state) => {
    return {...state.navigator};
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigateTo: (destination) => dispatch(actions.navigateTo(destination))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigator);

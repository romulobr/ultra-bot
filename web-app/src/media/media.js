import React, {Component} from 'react';
import styles from './media.module.scss';
import {connect} from 'react-redux';
import registerRendererEvents from './media-message-handlers';
import actions from './media-actions';
import LoadingSpinner from '../loading-spinner/loading-spinner'
import MediaOptionsForm from './media-options-form';
import {Link} from 'react-router-dom';

class MediaPanel extends Component {
    constructor(props) {
        super(props);
        this.createMediaItem = this.createMediaItem.bind(this);
        this.deleteMediaItems = this.deleteMediaItems.bind(this);
        this.renderItems = this.renderItems.bind(this);
        this.toMediaItemJSX = this.toMediaItemJSX.bind(this);
        this.toggleCheckedForDeletion = this.toggleCheckedForDeletion.bind(this);
        this.toggleAllCheckedForDeletion = this.toggleAllCheckedForDeletion.bind(this);
        this.handleCommandChange = this.handleCommandChange.bind(this);
        this.handleMediaInputChange = this.handleMediaInputChange.bind(this);
        this.fromState = this.fromState.bind(this);

        this.optionsRef = React.createRef();
        this.state = {
            items: this.props.items,
            enableStreamElementsIntegration: this.props.enableStreamElementsIntegration || false,
            checkedForDeletion: []
        };
    }

    render() {
        //console.log('props: ', this.props);
        return (
            <div className={styles.mediaPanel}>
                {this.props.isLoading && (<LoadingSpinner/>)}
                <div className='button-bar'>
                    <button type="button"
                            onClick={this.props.openMediaFolder}>
                        <span>1</span> Copy files
                    </button>
                    <button type="button" onClick={this.props.importMedia}>
                        <span>2</span> Import files
                    </button>
                    <button type="button"
                            disabled={this.props.loading || !this.props.user}
                            onClick={() => {
                                this.props.saveMedia(this.fromState(this.state))
                            }}>
                        <span>3</span>Save Settings
                    </button>
                </div>
                {!this.props.user && (
                    <h2 className="warning">
                        You need to <Link to="/">connect a streaming account</Link> to be able to save your settings.
                    </h2>)}
                <MediaOptionsForm ref={this.optionsRef} {...this.props}/>
                <div className={styles.mediaList}>
                    <table>
                        <thead>
                        <tr>
                            <th>
                                <button onClick={this.toggleAllCheckedForDeletion}>All</button>
                            </th>
                            <th>Command</th>
                            <th>File/URL</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.renderItems(this.state.items)}
                        </tbody>
                    </table>
                </div>
                {this.renderButtonBar()}
            </div>
        );
    }

    renderButtonBar() {
        return (
            <div>
                <div className='button-bar'>
                    <button type="button"
                            onClick={this.deleteMediaItems}>
                        Delete
                    </button>
                    <button type="button"
                            onClick={this.createMediaItem}>
                        New
                    </button>

                    <button type="button" disabled={this.props.loading}
                            onClick={() => {
                                this.props.saveMedia(this.fromState(this.state))
                            }}>
                        Save
                    </button>
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.props.registerRendererEvents();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            ...this.state,
            ...nextProps,
            checkedForDeletion: []
        });
    }

    fromState() {
        const formData = {...this.optionsRef.current.state, items: this.state.items};
        delete formData.props;
        return formData;
    }

    toggleCheckedForDeletion(checkBoxIndex) {
        const newCheckedForDeletion = [...this.state.checkedForDeletion];
        let arrayIndexOrMinusOne = this.state.checkedForDeletion.indexOf(checkBoxIndex);
        if (arrayIndexOrMinusOne !== -1) {
            newCheckedForDeletion.splice(arrayIndexOrMinusOne, 1);
        } else {
            newCheckedForDeletion.push(checkBoxIndex);
        }
        this.setState({
            items: this.state.items,
            checkedForDeletion: newCheckedForDeletion
        });
    }

    toggleAllCheckedForDeletion() {
        let newCheckedForDeletion;
        if (this.state.checkedForDeletion.length === this.state.items.length) {
            newCheckedForDeletion = [];
        } else {
            newCheckedForDeletion = [...this.state.items.keys()];
        }
        this.setState({
            items: this.state.items,
            checkedForDeletion: newCheckedForDeletion
        });
    }

    toMediaItemJSX(item, index) {
        return (
            <tr key={'media-item-' + index}>
                <td>
                    <input type="checkbox" checked={this.state.checkedForDeletion.includes(index)} onChange={() => {
                        this.toggleCheckedForDeletion(index)
                    }}/>
                </td>
                <td>
                    <input type="text"
                           name={'media-item-command-' + index}
                           value={item.command}
                           onChange={this.handleCommandChange}
                    />
                </td>
                <td>
                    <input type="text"
                           name={'media-item-url-' + index}
                           value={item.url}
                           onChange={this.handleMediaInputChange}
                    />
                </td>
            </tr>
        );
    }

    createMediaItem() {
        const items = this.state.items;
        items.push({command: '', url: ''});
        this.setState({...this.state, items});
    }

    deleteMediaItems() {
        const newItems = [...this.state.items];
        const sortedArray = this.state.checkedForDeletion.sort((a, b) => b - a);
        sortedArray.forEach(indexForDeletion => {
            newItems.splice(indexForDeletion, 1);
        });
        this.setState({
            items: newItems,
            checkedForDeletion: []
        });

    }

    handleCommandChange(e) {
        let newItems = [...this.state.items];
        const index = e.target.name.split('media-item-command-')[1];
        newItems[index].command = e.target.value;
        this.setState({...this.state, items: newItems})
    }

    handleMediaInputChange(e) {
        let newItems = [...this.state.items];
        const index = e.target.name.split('media-item-url-')[1];
        newItems[index].url = e.target.value;
        this.setState({...this.state, items: newItems})
    }

    renderItems(items) {
        return items ? items.map(this.toMediaItemJSX) : null;
    }
}

function mapStateToProps(state) {
    return {
        ...state.media,
        user: state.authentication.user,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        saveMedia: form => {
            dispatch(actions.saveMedia(form));
        },
        fetchMedia: () => {
            dispatch(actions.fetchMedia());
        },
        importMedia: () => {
            dispatch(actions.importMedia());
        },
        openMediaFolder: () => {
            dispatch(actions.openMediaFolder());
        },
        registerRendererEvents: () => {
            registerRendererEvents(dispatch)
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaPanel);

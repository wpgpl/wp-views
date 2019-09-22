/**
 * The View block preview component.
 *
 * A "ViewPreview" component is created that is used inside the Toolset View block to handle the previewing of the
 * selected View.
 *
 * @since  2.6.0
 */
import { debounce } from 'lodash';

import classnames from 'classnames';

const {
	__,
	sprintf,
} = wp.i18n;

const {
	Component,
} = wp.element;

const {
	Spinner,
} = wp.components;

const {
	toolset_view_block_strings: i18n,
} = window;

export default class ViewPreview extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			fetching: [],
			error: false,
			errorMessage: '',
			initialize: true,
		};

		this.getViewInfo = debounce( this.getViewInfo, 1500 );
	}

	componentDidMount() {
		this.getViewInfo();
	}

	componentDidUpdate( prevProps ) {
		const newView = this.props.attributes.view.ID !== prevProps.attributes.view.ID;
		const newLimit = this.props.attributes.limit !== prevProps.attributes.limit;
		const newOverrideLimit = this.props.attributes.overrideLimit !== prevProps.attributes.overrideLimit;
		const newOffset = this.props.attributes.offset !== prevProps.attributes.offset;
		const newOverrideOffset = this.props.attributes.overrideOffset !== prevProps.attributes.overrideOffset;
		const newOrderby = this.props.attributes.orderby !== prevProps.attributes.orderby;
		const newOverrideOrderby = this.props.attributes.overrideOrderby !== prevProps.attributes.overrideOrderby;
		const newOrder = this.props.attributes.order !== prevProps.attributes.order;
		const newOverrideOrder = this.props.attributes.overrideOrder !== prevProps.attributes.overrideOrder;
		const newSecondaryOrderby = this.props.attributes.secondaryOrderby !== prevProps.attributes.secondaryOrderby;
		const newOverrideSecondaryOrderby = this.props.attributes.overrideSecondaryOrderby !== prevProps.attributes.overrideSecondaryOrderby;
		const newSecondaryOrder = this.props.attributes.secondaryOrder !== prevProps.attributes.secondaryOrder;
		const newOverrideSecondaryOrder = this.props.attributes.overrideSecondaryOrder !== prevProps.attributes.overrideSecondaryOrder;
		const formDisplay = this.props.attributes.formDisplay !== prevProps.attributes.formDisplay;
		const queryFilters = this.props.attributes.queryFilters !== prevProps.attributes.queryFilters;

		if (
			newView ||
			newLimit ||
			newOverrideLimit ||
			newOffset ||
			newOverrideOffset ||
			newOrderby ||
			newOverrideOrderby ||
			newOrder ||
			newOverrideOrder ||
			newSecondaryOrderby ||
			newOverrideSecondaryOrderby ||
			newSecondaryOrder ||
			newOverrideSecondaryOrder ||
			formDisplay ||
			queryFilters
		) {
			this.getViewInfo(
				this.props.attributes.view.ID,
				this.props.attributes.limit,
				this.props.attributes.overrideLimit,
				this.props.attributes.offset,
				this.props.attributes.overrideOffset,
				this.props.attributes.orderby,
				this.props.attributes.overrideOrderby,
				this.props.attributes.order,
				this.props.attributes.overrideOrder,
				this.props.attributes.secondaryOrderby,
				this.props.attributes.overrideSecondaryOrderby,
				this.props.attributes.secondaryOrder,
				this.props.attributes.overrideSecondaryOrder,
				this.props.formDisplay,
				this.props.queryFilters
			);
		}
	}

	render() {
		if (
			this.state.initialize &&
			this.props.attributes.view
		) {
			// The preview of a saved View block is loading.
			this.setState(
				{
					initialize: false,
				}
			);
			return null;
		}

		if ( this.state.fetching.length > 0 ) {
			return this.renderPreviewLoading();
		}

		if ( this.state.error ) {
			return this.renderPreviewError();
		}

		if ( ! this.viewExists() ) {
			return this.renderViewDeleted();
		}

		return (
			<div className={ this.props.className } >
				<div dangerouslySetInnerHTML={ { __html: this.state.viewContent } }></div>
				<div dangerouslySetInnerHTML={ { __html: this.state.overlay } }></div>
			</div>
		);
	}

	renderPreviewLoading = () => {
		return (
			<div key="fetching" className={ classnames( this.props.className ) } >
				<div key="loading" className={ classnames( 'wp-block-embed is-loading' ) }>
					<Spinner />
					<p>{ __( 'Loading the View preview…', 'wpv-views' ) }</p>
				</div>
			</div>
		);
	};

	renderPreviewError = () => {
		return (
			<div key="error" className={ classnames( this.props.className ) } >
				<div className={ classnames( 'wpv-view-info-warning' ) }>
					{ this.state.errorMessage }
				</div>
			</div>
		);
	};

	viewExists = () => {
		const viewID = this.props.attributes.view.ID;
		const foundInPosts = i18n.publishedViews.posts.find( function( view ) {
			return view.ID === viewID;
		} );

		const foundInTaxonomy = i18n.publishedViews.taxonomy.find( function( view ) {
			return view.ID === viewID;
		} );

		const foundInUsers = i18n.publishedViews.users.find( function( view ) {
			return view.ID === viewID;
		} );

		return foundInPosts || foundInTaxonomy || foundInUsers;
	};

	renderViewDeleted = () => {
		return (
			<div className={ this.props.className } >
				<div className={ classnames( 'wpv-view-info-warning' ) }>
					{ sprintf( __( 'Error while retrieving the View preview. The selected View (ID: %s) was not found.', 'wpv-views' ), this.props.attributes.view.ID ) }
				</div>
			</div>
		);
	};

	getViewInfo = (
		viewId,
		limit,
		overrideLimit,
		offset,
		overrideOffset,
		orderby,
		overrideOrderby,
		order,
		overrideOrder,
		secondaryOrderby,
		overrideSecondaryOrderby,
		secondaryOrder,
		overrideSecondaryOrder,
		formDisplay,
		queryFilters
	) => {
		this.setState( {
			fetching: [ ...this.state.fetching, true ],
			error: false,
			errorMessage: '',
		} );

		const data = new window.FormData();
		data.append( 'action', i18n.actionName );
		data.append( 'wpnonce', i18n.wpnonce );
		data.append( 'view_id', 'undefined' === typeof viewId ? this.props.attributes.view.ID : viewId );
		data.append( 'limit', 'undefined' === typeof limit ? this.props.attributes.limit : limit );
		data.append( 'overrideLimit', 'undefined' === typeof overrideLimit ? this.props.attributes.overrideLimit : overrideLimit );
		data.append( 'offset', 'undefined' === typeof offset ? this.props.attributes.offset : offset );
		data.append( 'overrideOffset', 'undefined' === typeof overrideOffset ? this.props.attributes.overrideOffset : overrideOffset );
		data.append( 'orderby', 'undefined' === typeof orderby ? this.props.attributes.orderby : orderby );
		data.append( 'overrideOrderby', 'undefined' === typeof overrideOrderby ? this.props.attributes.overrideOrderby : overrideOrderby );
		data.append( 'order', 'undefined' === typeof order ? this.props.attributes.order : order );
		data.append( 'overrideOrder', 'undefined' === typeof overrideOrder ? this.props.attributes.overrideOrder : overrideOrder );
		data.append( 'secondaryOrderby', 'undefined' === typeof secondaryOrderby ? this.props.attributes.secondaryOrderby : secondaryOrderby );
		data.append( 'overrideSecondaryOrderby', 'undefined' === typeof overrideSecondaryOrderby ? this.props.attributes.overrideSecondaryOrderby : overrideSecondaryOrderby );
		data.append( 'secondaryOrder', 'undefined' === typeof secondaryOrder ? this.props.attributes.secondaryOrder : secondaryOrder );
		data.append( 'overrideSecondaryOrder', 'undefined' === typeof overrideSecondaryOrder ? this.props.attributes.overrideSecondaryOrder : overrideSecondaryOrder );
		data.append( 'formDisplay', 'undefined' === typeof formDisplay ? this.props.attributes.formDisplay : formDisplay );
		data.append( 'queryFilters', JSON.stringify( 'undefined' === typeof queryFilters ? this.props.attributes.queryFilters : queryFilters ) );

		window.fetch( window.ajaxurl, {
			method: 'POST',
			body: data,
			credentials: 'same-origin',
		} ).then( res => res.json() )
			.then( response => {
				let newState = {};
				if (
					0 !== response &&
					response.success
				) {
					const viewID = response.data.view_id,
						hasCustomSearch = response.data.hasCustomSearch,
						hasSubmit = response.data.hasSubmit,
						hasExtraAttributes = response.data.hasExtraAttributes,
						viewContent = response.data.viewContent,
						overlay = response.data.overlay;

					newState = {
						viewID,
						hasCustomSearch,
						hasSubmit,
						hasExtraAttributes,
						viewContent,
						overlay,
					};
				} else {
					let message = '';
					if (
						'undefined' !== typeof response.data &&
						'undefined' !== typeof response.data.message ) {
						message = response.data.message;
					} else {
						message = __( 'An error occurred while trying to get the View information.', 'wpv-views' );
					}

					newState.error = true;
					newState.errorMessage = message;
				}

				this.state.fetching.pop();
				newState.fetching = this.state.fetching;

				this.props.onPreviewStateUpdate( newState );
				return this.setState( newState );
			} );
	};
}

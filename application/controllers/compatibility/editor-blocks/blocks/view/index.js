/**
 * Handles the creation and the behavior of the Toolset View block.
 *
 * @since  2.6.0
 */

/**
 * Block dependencies
 */
import icon from './icon';
import Inspector from './inspector/inspector';
import ViewSelect from './inspector/view-select';
import ViewPreview from './view-preview';
import classnames from 'classnames';
import './styles/editor.scss';

/**
 * Internal block libraries
 */
const {
	__,
	setLocaleData,
} = wp.i18n;

const {
	registerBlockType,
} = wp.blocks;

const {
	Placeholder,
} = wp.components;

const {
	RawHTML,
} = wp.element;

const {
	toolset_view_block_strings: i18n,
} = window;

if ( i18n.locale ) {
	setLocaleData( i18n.locale, 'wpv-views' );
}

const name = i18n.blockName;

const settings = {
	// translators: The name of the View block that will appear in the editor's block inserter.
	title: __( 'View', 'wpv-views' ),
	description: __( 'Add a Post, User, or Taxonomy View to the editor.', 'wpv-views' ),
	category: i18n.blockCategory,
	icon: icon.blockIcon,
	keywords: [
		__( 'Toolset', 'wpv-views' ),
		__( 'View', 'wpv-views' ),
		__( 'Shortcode', 'wpv-views' ),
	],

	supports: {
		align: [ 'wide', 'full' ],
	},

	edit: props => {
		const setDefaults = () => {
			props.setAttributes(
				{
					align: '',
					formDisplay: 'full',
					formOnlyDisplay: 'samePage',
					hasCustomSearch: false,
					hasExtraAttributes: [],
					hasSubmit: false,
					limit: -1,
					offset: 0,
					order: '',
					orderby: '',
					otherPage: '',
					overrideLimit: false,
					overrideOffset: false,
					overrideOrder: false,
					overrideOrderby: false,
					overrideSecondaryOrder: false,
					overrideSecondaryOrderby: false,
					queryFilters: {},
					secondaryOrder: '',
					secondaryOrderby: '',
				}
			);
		};

		const onChangeView = ( event ) => {
			props.setAttributes( { view: event.target.value } );
		};

		const onChangeFormDisplay = ( value ) => {
			props.setAttributes( { formDisplay: value } );
		};

		const onChangeFormOnlyDisplay = ( value ) => {
			props.setAttributes( { formOnlyDisplay: value } );
		};

		const onChangeotherPage = value => {
			props.setAttributes( { otherPage: value } );
		};

		const onChangeQueryFilters = ( value, filterType ) => {
			const newQueryFilters = Object.assign( {}, props.attributes.queryFilters );
			newQueryFilters[ filterType ] = value;
			props.setAttributes( { queryFilters: newQueryFilters } );
		};

		const onPreviewStateUpdate = ( state ) => {
			props.setAttributes( { hasCustomSearch: state.hasCustomSearch } );
			props.setAttributes( { hasSubmit: state.hasSubmit } );
			if ( JSON.stringify( props.attributes.hasExtraAttributes ) !== JSON.stringify( state.hasExtraAttributes ) ) {
				props.setAttributes( { hasExtraAttributes: state.hasExtraAttributes } );
				if (
					'undefined' !== typeof state.hasExtraAttributes &&
					state.hasExtraAttributes.length <= 0 ) {
					props.setAttributes( { queryFilters: {} } );
				}
			}
		};

		const {
			posts,
			taxonomy,
			users,
		} = i18n.publishedViews;

		return [
			!! (
				props.focus ||
				props.isSelected
			) && (
				<Inspector
					{ ... props }
					key="wpv-gutenberg-view-block-render-inspector"
					className={ classnames( 'wp-block-toolset-view-inspector' ) }
					onChangeFormDisplay={ onChangeFormDisplay }
					onChangeFormOnlyDisplay={ onChangeFormOnlyDisplay }
					onChangeotherPage={ onChangeotherPage }
					onChangeQueryFilters={ onChangeQueryFilters }
					setDefaults={ setDefaults }
				/>
			),
			( '' === props.attributes.view ?
				<Placeholder
					key="view-block-placeholder"
					className={ classnames( 'wp-block-toolset-view' ) }
				>
					<div className="wp-block-toolset-view-placeholder">
						{ icon.blockPlaceholder }
						<h2>{ __( 'Toolset View', 'wpv-views' ) }</h2>
						<ViewSelect
							attributes={
								{
									posts: posts,
									taxonomy: taxonomy,
									users: users,
									view: props.attributes.view,
								}
							}
							className={ classnames( 'components-select-control__input' ) }
							onChangeView={ onChangeView }
						/>
					</div>
				</Placeholder> :
				<ViewPreview
					key="toolset-view-gutenberg-block-preview"
					className={ classnames( props.className, 'wp-block-toolset-view-preview' ) }
					attributes={
						{
							... props.attributes,
							view: {
								ID: isNaN( props.attributes.view ) ? JSON.parse( props.attributes.view ).ID : props.attributes.view,
							},
						}
					}
					onPreviewStateUpdate={ onPreviewStateUpdate }
				/>
			),
		];
	},
	save: ( props ) => {
		let view = isNaN( props.attributes.view ) ? JSON.parse( props.attributes.view ).post_name || '' : props.attributes.view,
			shortcodeStart = '[wpv-view',
			limit = '',
			offset = '',
			orderby = '',
			order = '',
			secondaryOrderby = '',
			secondaryOrder = '',
			target = '',
			queryFilters = '',
			viewDisplay = '';

		const shortcodeEnd = ']';

		// If there's no URL, don't save any inline HTML.
		if ( '' === view ) {
			return null;
		}

		if ( isNaN( view ) ) {
			view = ' name="' + view + '"';
		} else {
			view = ' id="' + view + '"';
		}

		if ( 'form' !== props.attributes.formDisplay ) {
			if (
				props.attributes.overrideLimit &&
				-1 <= parseInt( props.attributes.limit )
			) {
				limit = ' limit="' + props.attributes.limit + '"';
			}

			if (
				props.attributes.overrideOffset &&
				0 <= parseInt( props.attributes.offset )
			) {
				offset = ' offset="' + props.attributes.offset + '"';
			}

			if (
				props.attributes.overrideOrderby &&
				'' !== props.attributes.orderby
			) {
				orderby = ' orderby="' + props.attributes.orderby + '"';
			}

			if (
				props.attributes.overrideOrder &&
				'' !== props.attributes.order
			) {
				order = ' order="' + props.attributes.order + '"';
			}

			if (
				props.attributes.overrideSecondaryOrderby &&
				'' !== props.attributes.secondaryOrderby
			) {
				secondaryOrderby = ' orderby_second="' + props.attributes.secondaryOrderby + '"';
			}

			if (
				props.attributes.overrideSecondaryOrder &&
				'' !== props.attributes.secondaryOrder
			) {
				secondaryOrder = ' order_second="' + props.attributes.secondaryOrder + '"';
			}
		}

		if (
			props.attributes.hasCustomSearch &&
			'form' === props.attributes.formDisplay
		) {
			shortcodeStart = '[wpv-form-view';
			if ( 'samePage' === props.attributes.formOnlyDisplay ) {
				target = ' target_id="self"';
			} else if (
				'otherPage' === props.attributes.formOnlyDisplay &&
				props.attributes.hasSubmit &&
				'' !== props.attributes.otherPage.value
			) {
				target = ' target_id="' + props.attributes.otherPage.value + '"';
			}
		}

		if (
			props.attributes.hasCustomSearch &&
			'results' === props.attributes.formDisplay
		) {
			target = '';
			viewDisplay = ' view_display="layout"';
		}

		props.attributes.hasExtraAttributes.forEach(
			function( item ) {
				if (
					0 < Object.keys( props.attributes.queryFilters ).length &&
					props.attributes.queryFilters[ item[ 'filter_type' ] ]
				) {
					queryFilters += ' ' + item.attribute + '="' + props.attributes.queryFilters[ item[ 'filter_type' ] ] + '"';
				}
			}
		);

		return <RawHTML>{ shortcodeStart + view + limit + offset + orderby + order + secondaryOrderby + secondaryOrder + target + viewDisplay + queryFilters + shortcodeEnd }</RawHTML>;
	},
};

registerBlockType( name, settings );

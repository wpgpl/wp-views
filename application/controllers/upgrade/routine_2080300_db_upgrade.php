<?php

namespace OTGS\Toolset\Views\Controller\Upgrade;

/**
 * Upgrade database to 2080300 (Forms 2.8.3)
 *
 * Batch set default values for post and user forms settings about:
 * - hide comments
 * - include Add Media buttons on frontend editors
 * - include Toolset buttons on frontend editors
 *
 * @since 2.1.2
 */
class Routine2080300DbUpgrade implements IRoutine {

	/**
	 * Constructor.
	 */
	public function __construct() {}

	/**
	 * Execute database upgrade up to 2.1.2
	 *
	 * @param array $args
	 * @since 2.1.2
	 */
	public function execute_routine( $args = array() ) {
		do_action( \OTGS\Toolset\Views\Controller\Cache\Meta\Post\Invalidator::FORCE_DELETE_ACTION );
	}

}

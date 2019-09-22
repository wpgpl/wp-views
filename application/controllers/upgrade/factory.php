<?php

namespace OTGS\Toolset\Views\Controller\Upgrade;

/**
 * Plugin upgrade factory for upgrade routines.
 *
 * @since 2.8.3
 */
class Factory {

	/**
	 * Get the righ routine given its signature key.
	 *
	 * @param string $routine
	 * @return \OTGS\Toolset\Views\Controller\Upgrade\IRoutine
	 * @since 2.8.3
	 */
	public function get_routine( $routine ) {
		$dic = apply_filters( 'toolset_dic', false );
		switch ( $routine ) {
			case 'upgrade_db_to_2080300':
				$upgrade_db_to_2080300 = $dic->make( '\OTGS\Toolset\Views\Controller\Upgrade\Routine2080300DbUpgrade' );
				return $upgrade_db_to_2080300;
				break;
			default:
				throw new \Exception( 'Unknown routine' );
		}
	}

}

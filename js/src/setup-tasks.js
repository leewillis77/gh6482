/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';
import apiFetch from '@wordpress/api-fetch';
import { Button, Card, CardBody, CardHeader } from '@wordpress/components';

/**
 * WooCommerce dependencies
 */
import { H } from '@woocommerce/components';
import { getHistory, getNewPath } from '@woocommerce/navigation';

/* global my_setup_tasks_data */
const markTaskComplete = ( varName ) => {
	return () => {
		const dataObj = {};
		dataObj[ varName ] = true;
		apiFetch( {
					  path: '/wc-admin/options',
					  method: 'POST',
					  data: dataObj,
				  } )
			.then( () => {
				// Set the local concept of completeness to true so that task appears complete on the list.
				my_setup_tasks_data[ varName ] = true;
				// Redirect back to the root WooCommerce Admin page.
				getHistory().push( getNewPath( {}, '/', {} ) );
			} );
	}
};

const markTaskIncomplete = ( varName ) => {
	return () => {
		const dataObj = {};
		dataObj[ varName ] = false;
		apiFetch( {
					  path: '/wc-admin/options',
					  method: 'POST',
					  data: dataObj,
				  } )
			.then( () => {
				// Set the local concept of completeness to true so that task appears complete on the list.
				my_setup_tasks_data[ varName ] = false;
				// Redirect back to the root WooCommerce Admin page.
				getHistory().push( getNewPath( {}, '/', {} ) );
			} );
	}
};

const ConfigureSettingsTask = () => {
	return (
		<Card className="woocommerce-task-card">
			<CardHeader>
				<H>
					Header
				</H>
			</CardHeader>
			<CardBody>
				<p>Body</p>
				<div>
					{my_setup_tasks_data.my_configure_settings_is_complete ? (
						<Button isPrimary
								onClick={markTaskIncomplete( 'my_configure_settings_is_complete' )}>
							{__( 'Mark task incomplete', 'woocommerce_gpf' )}
						</Button>
					) : (
						 <Button isPrimary
								 onClick={markTaskComplete( 'my_configure_settings_is_complete' )}>
							 {__( 'Mark task complete', 'woocommerce_gpf' )}
						 </Button>
					 )}
				</div>
			</CardBody>
		</Card>
	);
};

/**
 * Use the 'woocommerce_admin_onboarding_task_list' filter to add a task page.
 */
addFilter(
	'woocommerce_admin_onboarding_task_list',
	'woocommerce_gpf',
	( tasks ) => {
		return [
			...tasks,
			{
				key: 'my_configure_settings',
				title: 'Title',
				container: <ConfigureSettingsTask/>,
				completed: my_setup_tasks_data.my_configure_settings_is_complete,
				visible: true,
				additionalInfo: 'Additional info',
				time: __( '5 minutes', 'woocommerce-admin' ),
				isDismissable: false,
			},
		];
	}
);

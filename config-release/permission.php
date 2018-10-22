<?php
return [
    'one'   => [
        'resource'              => ['*'],
        'manage'                => ['*'],
        'seller'                => ['*'],
        'ebooking-order'        => ['*'],
        'ebooking-source'       => ['*'],
        'user'                  => ['*'],
        'supplier-account'      => ['*'],
        'supplier-submit-order' => ['*'],
    ],
    'two'   => [
        'resource'              => ['*'],
        'manage'                => ['*'],
        'seller'                => ['*'],
        'ebooking-order'        => ['*'],
        'ebooking-source'       => ['*'],
        'user'                  => ['password', 'update', 'update-ajax', 'password-ajax'],
        'supplier-account'      => ['*'],
        'supplier-submit-order' => ['*'],
    ],
    'three' => [
        'resource'              => ['index'],
        'ebooking-order'        => ['*'],
        'ebooking-source'       => ['*'],
        'user'                  => ['password', 'update', 'update-ajax', 'password-ajax'],
        'supplier-account'      => ['*'],
        'supplier-submit-order' => ['*'],
    ],
    'four'  => [
        'resource'              => ['index', 'basic'],
        'manage'                => ['room-list'],
        'user'                  => ['password', 'update', 'update-ajax', 'password-ajax'],
        'supplier-account'      => ['*'],
        'supplier-submit-order' => ['*'],
    ],
];

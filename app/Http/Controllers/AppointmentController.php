<?php

namespace Cv\Http\Controllers;

use Illuminate\Http\Request;

use Cv\Http\Requests;
use Cv\Http\Controllers\Controller;

use Cv\Model;

class AppointmentController extends Controller
{

    public $auth;
    public $appointment;

    public function __construct(
            \Cv\Service\AuthService $auth,
            \Cv\Service\AppointmentService $appointment
        )
    {
        $this->auth = $auth;
        $this->appointment = $appointment;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $me = $this->auth->getLoginedUser();

        $appointments = $this->appointment->getByUser($me);

        return response()->json($appointments);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $me          = $this->auth->getLoginedUser();
        $guest       = $request->get("guest");
        $userId      = $request->get("userId");
        $meetingTime = $request->get("meetingTime");
        $place       = $request->get("place");

        $validator = $this->appointment->validate($request->all());
        if($validator->fails()) {
            return response()->json($validator->messages(), 401);
        }

        $appointment = $this->appointment->create($userId, $me->id, $guest, $place, $meetingTime);

        return response()->json($appointment, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $me = $this->auth->getLoginedUser();
        $appointment = $this->appointment->get($me);

        return response()->json($appointment, 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
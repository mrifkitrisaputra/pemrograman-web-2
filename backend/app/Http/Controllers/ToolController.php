<?php

namespace App\Http\Controllers;

use App\Models\Tool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ToolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tools = Tool::all();
        return response()->json(['data' => $tools]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function toolStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:tools|max:255',
            'category' => 'required|max:255',
            'description' => 'nullable|string',
            'installation_command' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tool = Tool::create($request->all());
        return response()->json(['data' => $tool, 'message' => 'Tool created successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Tool $tool)
    {
        return response()->json(['data' => $tool]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tool $tool)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:tools,name,' . $tool->id . '|max:255',
            'category' => 'required|max:255',
            'description' => 'nullable|string',
            'installation_command' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tool->update($request->all());
        return response()->json(['data' => $tool, 'message' => 'Tool updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tool $tool)
    {
        $tool->delete();
        return response()->json(['message' => 'Tool deleted successfully']);
    }
}
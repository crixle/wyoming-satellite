#!/usr/bin/env python3
"""

Accepts event data and transmits it in a Flask friendly way
START THIS SCRIPT BEFORE RUNNING THE SATELLITE

"""
import argparse
import asyncio
import logging
import time
import requests
from functools import partial
from queue import Queue
from flask import Flask, jsonify, render_template_string
from wyoming.event import Event
from wyoming.server import AsyncEventHandler, AsyncServer

import json

event_url = "http://localhost:1212/event"
headers = {
    'Content-Type': 'application/json'
}

_LOGGER = logging.getLogger()

class SatelliteEventHandler(AsyncEventHandler):
    """Event handler for clients."""

    def __init__(self, cli_args: argparse.Namespace, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.cli_args = cli_args
        self.client_id = str(time.monotonic_ns())
        _LOGGER.debug("Client connected: %s", self.client_id)


    async def handle_event(self, event: Event) -> bool:
        _LOGGER.debug(event)
        def send_event(payload):
            try:
                response = requests.post(event_url, headers=headers, data=payload)
            except:
                print("Can't connect to Flask")

        match event.type:
            case "detection":
                _LOGGER.info(f"Detected wake word: {event.data['name']}") # Print wake word
                payload = json.dumps({
                    event.type: event.data['name']
                })
                send_event(payload)
            case "transcript":
                _LOGGER.info(f"User said: {event.data['text']}") # Print speech-to-text phrase
                payload = json.dumps({
                    event.type: event.data['text']
                })
                send_event(payload)
            case "synthesize":
                _LOGGER.info(f"Assist responded: {event.data['text']}") # Print response text
                payload = json.dumps({
                    event.type: event.data['text']
                })
                send_event(payload)
            case "played":
                _LOGGER.info("Response finished.")
                payload = json.dumps({
                    "response_finished": True
                })
                send_event(payload)
            case _:
                print(event)
                


        return True

async def main() -> None:
    """Main entry point."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--uri", required=False, help="unix:// or tcp://", default="tcp://0.0.0.0:8675")
    parser.add_argument("--debug", action="store_true", help="Log DEBUG messages")
    args = parser.parse_args()

    logging.basicConfig(level=logging.DEBUG if args.debug else logging.INFO)
    _LOGGER.debug(args)

    _LOGGER.info("Ready")


    # Start async server
    server = AsyncServer.from_uri(args.uri)
    try:
        await server.run(partial(SatelliteEventHandler, args))
    except KeyboardInterrupt:
        pass

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass

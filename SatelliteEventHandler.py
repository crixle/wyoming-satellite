#!/usr/bin/env python3
"""Accepts event data and transmits it in a Flask friendly way"""
import argparse
import asyncio
import logging
import time
import threading
from functools import partial
from queue import Queue
from flask import Flask, jsonify, render_template_string
from wyoming.event import Event
from wyoming.server import AsyncEventHandler, AsyncServer

import json

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

        match event.type:
            case "transcript":
                print(f"User said: {event[0]['text']}")

        print(f"{event.type}: {event_data}")

        if event.type == "detect" and event.data:
            print(f"Detected wake word: {event.data.get('name')}")



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

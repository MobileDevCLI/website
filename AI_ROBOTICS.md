# AI Robotics Control - Next Invention

**Status**: Research & Development
**Started**: Pre-2024 (years of experimentation)
**Documentation Started**: January 4, 2026
**Inventor**: Samblamz

---

## Overview

This project documents the methodology for **AI-controlled robotics** using:
- WiFi/ExpressLRS signal control
- Video feedback loops
- Multimodal AI decision making
- Specialized model orchestration (MediaPipe, YOLO)

**Core principle**: AI orchestrates control, offloading specific tasks to specialized models for speed and accuracy.

---

## Hardware Inventory

### Drones

| Device | Status | Control Method | Video | SDK |
|--------|--------|----------------|-------|-----|
| Cheap WiFi Drones | Working | WiFi direct | Yes | Reverse-engineered |
| DJI Tello TT | **Autonomous achieved** | WiFi SDK | Yes | Official |
| DJI development drone | In progress | SDK | Yes | Official |

### Ground Robots

| Device | Status | Control Method | SDK |
|--------|--------|----------------|-----|
| DJI RoboMaster S1 | Limited | Closed environment | No (JavaScript only, closed) |
| DJI RoboMaster EP (with arm) | In progress | Official SDK | Yes |

### Control Hardware

| Device | Purpose |
|--------|---------|
| WiFi dongle (Lenovo PC) | Signal scanning, connection |
| ExpressLRS TX/RX | Low-latency RC control |
| Video TX/RX | FPV feedback |

---

## Technical Architecture

### The Signal Chain

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI CONTROL SYSTEM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │   AI     │───▶│ Control  │───▶│   TX     │───▶│   RX     │  │
│  │ (Claude/ │    │ Signals  │    │ (WiFi/   │    │ (On      │  │
│  │  Local)  │    │ Generate │    │  ELRS)   │    │  Robot)  │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       ▲                                               │         │
│       │                                               ▼         │
│       │                                         ┌──────────┐   │
│       │                                         │  Motors/ │   │
│       │                                         │  Servos  │   │
│       │                                         └──────────┘   │
│       │                                               │         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐       │         │
│  │  Video   │◀───│  Video   │◀───│  Video   │◀──────┘         │
│  │ Analysis │    │   RX     │    │   TX     │                  │
│  └──────────┘    └──────────┘    └──────────┘                  │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────┐    ┌──────────┐                                  │
│  │MediaPipe │    │  YOLO    │  (Offloaded detection)           │
│  │Detection │    │ Models   │                                  │
│  └──────────┘    └──────────┘                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Technical Challenges

1. **Signal Acquisition**
   - Scanning for device signals (WiFi, 2.4GHz, 900MHz)
   - Establishing stable connection
   - Maintaining connection under movement

2. **Dual Channel Operation**
   - Control signals (outbound): Commands to motors/servos
   - Video signals (inbound): Camera feed for AI analysis
   - Both must be low-latency

3. **Latency Budget**
   - ExpressLRS: Up to 1000Hz (1ms theoretical)
   - DJI: Sub-20ms typical
   - WiFi drones: Variable (50-200ms)
   - AI inference must fit within latency budget

4. **AI Architecture**
   - Multimodal AI (Claude/GPT-4V or local) for decision making
   - Offload detection to specialized models:
     - **MediaPipe**: Pose detection, hand tracking, face mesh
     - **YOLO**: Object detection, tracking
   - AI orchestrates, doesn't do everything itself
   - This keeps AI responsive while specialized models handle compute-heavy tasks

---

## Control Protocols

### WiFi Drones (Cheap/Tello)

```
Connection: WiFi Direct to drone AP
Control: UDP packets to drone IP
Video: RTSP stream or UDP video port
SDK: Tello SDK (official) or reverse-engineered
```

### ExpressLRS

```
Control: CRSF protocol over UART
Channels: 16 channels (4 full resolution, 12 switch)
Output: PWM to servos/ESCs
Latency: Sub-5ms achievable
```

### DJI RoboMaster

```
S1: Closed JavaScript environment (limited)
EP: Full SDK access (Python, Swift)
Control: WiFi or USB
Video: H.264 stream
```

---

## AI Integration Approach

### NOT This (Slow, Overloaded)

```
AI receives video → AI does ALL detection → AI decides → AI sends control
(Too slow - AI bottlenecked on detection)
```

### This (Fast, Orchestrated)

```
Video → MediaPipe/YOLO (parallel) → Results to AI
AI receives: [video frame + detection results]
AI decides: "Target at coordinates X,Y, move left"
AI sends: Control signal
```

### Why This Works

- **MediaPipe**: Optimized for real-time, runs on GPU/NPU
- **YOLO**: Fast object detection, can run on edge devices
- **AI**: Focuses on decision-making, not pixel processing
- **Result**: AI stays responsive, detection stays accurate

---

## Development Phases

### Phase 1: WiFi Drone Control (DONE)
- [x] Connect to cheap WiFi drones
- [x] Control motors via AI
- [x] Get video feedback
- [x] Basic autonomous behavior

### Phase 2: Tello TT (DONE)
- [x] SDK integration
- [x] Autonomous flight achieved
- [x] Video processing pipeline

### Phase 3: ExpressLRS Integration (IN PROGRESS)
- [ ] PWM output from AI decisions
- [ ] Low-latency control loop
- [ ] Video feedback via separate channel

### Phase 4: DJI RoboMaster EP (IN PROGRESS)
- [ ] SDK access confirmed
- [ ] Control via Python
- [ ] Vision pipeline integration

### Phase 5: Full AI Orchestration
- [ ] MediaPipe integration
- [ ] YOLO model integration
- [ ] Multi-model pipeline
- [ ] Real-time decision making

---

## Prior Art Search Status

**Searched January 4, 2026**

| Topic | Documented? | Gap |
|-------|-------------|-----|
| ExpressLRS + AI control | NO | General methodology missing |
| WiFi drone AI control | Partial | No complete guide |
| MediaPipe + drone | Academic only | No hobbyist methodology |
| YOLO + RC control | Limited | Military applications only |
| AI orchestration pattern | NO | Novel approach |

**Conclusion**: The complete methodology - AI orchestrating specialized models for real-time robot control via ExpressLRS/WiFi - is undocumented.

---

## Safety & Legal

- All testing on personal property
- No public airspace violations
- FCC compliance for radio equipment
- This is hobbyist/research, not commercial

---

## Key Principles

1. **No Hallucination** - Every claim must be testable on real hardware
2. **Real Latency** - Measure actual latency, don't assume
3. **Signal First** - Connection must be stable before AI control
4. **Graceful Degradation** - If AI fails, manual override must work
5. **Document Everything** - Screenshots, logs, timestamps

---

## Resources

### Hardware Links
- [ExpressLRS Official](https://www.expresslrs.org/)
- [DJI RoboMaster](https://www.dji.com/robomaster-s1)
- [Tello SDK](https://www.ryzerobotics.com/tello)

### AI/ML Tools
- [MediaPipe](https://mediapipe.dev/)
- [YOLO (Ultralytics)](https://ultralytics.com/)

### Documentation
- MobileCLI website (Pro section) - Coming soon
- This file + GENESIS when methodology is proven

---

*This document captures the current state of AI robotics research. It will be expanded as methodology is proven and documented.*


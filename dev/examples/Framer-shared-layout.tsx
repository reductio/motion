import {
    AnimateSharedLayout,
    AnimatePresence,
    SharedLayoutTree,
    motion,
} from "@framer"
import * as React from "react"

interface AppState {
    treeOrder: Record<string, number>
    trees: Record<string, any>
    history: string[]
}

export const App = () => {
    const [state, setState] = React.useState<AppState>({
        treeOrder: { a: 0 },
        history: ["a"],
        trees: { a: A },
    })

    const nextTree = React.useCallback(() => {
        setState(nextState)
    }, [setState])

    return (
        <div onClick={nextTree}>
            <AnimateSharedLayout
                type="crossfade"
                _supportRotate
                transition={{ duration: 2 }}
            >
                <AnimatePresence>
                    {Object.keys(state.trees).map(treeKey => {
                        const treeOrder = state.treeOrder[treeKey]
                        const SomeTree = state.trees[treeKey]
                        const isLead = treeOrder === state.history.length - 1
                        const isFollow = treeOrder === state.history.length - 2

                        return (
                            <div
                                style={{
                                    ...wrapper,
                                    zIndex: treeOrder,
                                    visibility:
                                        isLead || isFollow
                                            ? "visible"
                                            : "hidden",
                                }}
                                key={treeKey}
                            >
                                <SharedLayoutTree
                                    order={treeOrder}
                                    lead={
                                        treeOrder === state.history.length - 1
                                    }
                                >
                                    <SomeTree />
                                </SharedLayoutTree>
                            </div>
                        )
                    })}
                </AnimatePresence>
            </AnimateSharedLayout>
        </div>
    )
}

const wrapper: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
}

const card = {
    position: "absolute",
    top: 50,
    left: 50,
    width: 200,
    height: 200,
    background: "rgba(0,0,255,0.5)",
    borderRadius: 10,
}

function A({}) {
    return (
        <motion.div layoutId="parent">
            <motion.div
                layoutId="card"
                transition={{ duration: 2 }}
                _shouldAnimateLayout={calc => {
                    console.trace("call should animate for a", calc)
                    return calc ? true : false
                }}
                style={{ ...card, top: 200, background: "green" }}
            ></motion.div>
        </motion.div>
    )
}

function B({}) {
    return (
        <motion.div layoutId="parent">
            <motion.div
                layoutId="card"
                transition={{ duration: 2 }}
                _shouldAnimateLayout={calc => {
                    console.trace("call should animate for b", calc)
                    return calc ? true : false
                }}
                style={{ ...card, top: 100, background: "red" }}
            ></motion.div>
        </motion.div>
    )
}

function C({}) {
    return (
        <motion.div layoutId="parent">
            <motion.div
                layoutId="card"
                _shouldAnimateLayout={calc => {
                    console.trace("call should animate for c", calc)
                    return calc ? false : false
                }}
                style={{ ...card, background: "blue" }}
            ></motion.div>
        </motion.div>
    )
}

function nextState(currentState: AppState): AppState {
    switch (currentState.history.length) {
        case 1:
            return {
                treeOrder: {
                    ...currentState.treeOrder,
                    b: 1,
                },
                trees: {
                    ...currentState.trees,
                    b: B,
                },
                history: ["a", "b"],
            }
        case 2:
            return {
                treeOrder: {
                    ...currentState.treeOrder,
                    c: 2,
                },
                trees: {
                    ...currentState.trees,
                    c: C,
                },
                history: ["a", "b", "c"],
            }
        case 3:
            return {
                ...currentState,
                treeOrder: {
                    ...currentState.treeOrder,
                    a: 3,
                },
                history: ["a", "b", "c", "a"],
            }
        case 4:
            return {
                ...currentState,
                treeOrder: {
                    ...currentState.treeOrder,
                    b: 4,
                },
                history: ["a", "b", "c", "a", "b"],
            }
        case 5:
            return {
                ...currentState,
                treeOrder: {
                    ...currentState.treeOrder,
                    c: 5,
                },
                history: ["a", "b", "c", "a", "b", "c"],
            }

        default:
            break
    }
}
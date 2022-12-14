type TGraph = Array<Array<number>>;
type TParent = Array<number>;
type TVector = number | any;

type TOutput = string | undefined;
type TOutputStack = Array<string>;

const numberOfVertices: number = 5;
const INF: number = -Infinity;

const graph: TGraph = [
  [INF, 20, 30, 10, INF],
  [0, INF, 40, INF, 30],
  [0, 0, INF, 10, 20],
  [0, INF, 5, INF, 20],
  [INF, 0, 0, 0, INF],
];

function createOutput(u: number, v: number, residualGraph: TGraph, pathFlow: number): string {
  // return `Path: (${u + 1}, ${v + 1}) Flow Amount: ${pathFlow}, Route: ${u + 1} -> ${v + 1}`;
  return `Path: (${u + 1}, ${v + 1}), Flow Sub: (${graph[u][v]}, 0) - (0, ${residualGraph[u][v]}) = ${
    graph[v][u] - residualGraph[v][u]
  }, Flow Amount: ${pathFlow}, Route: ${u + 1} -> ${v + 1}`;
}

function breadthFirstSearch(residualGraph: TGraph, source: number, sink: number, parent: TParent): boolean {
  const visited = new Array<Boolean>(numberOfVertices);
  for (let i = 0; i < numberOfVertices; i++) {
    visited[i] = false;
  }

  let queue: Array<number> = [];
  queue.push(source);
  visited[source] = true;
  parent[source] = -1;

  while (queue.length != 0) {
    let u: TVector = queue.shift();

    for (let v = 0; v < numberOfVertices; v++) {
      if (visited[v] == false && residualGraph[u][v] > 0) {
        if (v == sink) {
          parent[v] = u;
          return true;
        }
        queue.push(v);
        parent[v] = u;
        visited[v] = true;
      }
    }
  }

  return false;
}

function fordFulkerson(graph: TGraph, source: number, sink: number): number {
  if (source < 0 || sink < 0) return INF;
  if (source > numberOfVertices || sink > numberOfVertices) return INF;

  const outputStack: TOutputStack = [];

  let u: number, v: number;

  let residualGraph: TGraph = new Array<Array<number>>(numberOfVertices);

  for (u = 0; u < numberOfVertices; u++) {
    residualGraph[u] = new Array(numberOfVertices);
    for (v = 0; v < numberOfVertices; v++) {
      residualGraph[u][v] = graph[u][v];
    }
  }

  let parent: TParent = new Array(numberOfVertices);

  let maxFlow: number = 0;
  let pathFlow: number;

  while (breadthFirstSearch(residualGraph, source, sink, parent)) {
    pathFlow = Number.MAX_VALUE;
    for (v = sink; v != source; v = parent[v]) {
      u = parent[v];
      pathFlow = Math.min(pathFlow, residualGraph[u][v]);
    }

    for (v = sink; v != source; v = parent[v]) {
      u = parent[v];

      outputStack.push(createOutput(u, v, residualGraph, pathFlow));

      residualGraph[u][v] -= pathFlow;
      residualGraph[v][u] += pathFlow;
    }

    let output: TOutput = '';
    while ((output = outputStack.pop()) != undefined) {
      console.log(output);
    }

    maxFlow += pathFlow;
    console.log(`Max Flow: ${maxFlow}`);
  }

  return maxFlow;
}

const maxPossibleFlow: number = fordFulkerson(graph, 0, 4);
console.log(`For the given graph, the maximum flow is ${maxPossibleFlow}`);

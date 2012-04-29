
var gMaxDepth = 10
var gPlayingUpTo = 6
var gWin = gPlayingUpTo * 10
var gLose = -1 * gWin
var gGoodGuyThreePct = (1/3)
var gGoodGuyTwoPct = (1/2)
var gBadGuyThreePct = (1/3)
var gBadGuyTwoPct = (1/2)

var gGoodGuy = "GoodGuy"
var gBadGuy = "BadGuy"

/*
var kGoodGuy = "a"
var kBadGuy = "b"
var kPossession = "c"
var kEventType = "d"
*/

//the node types - either it's a decision, or it's a random event 
var gDecision = "Decision"
var gThreePointShot = "ThreePointShot"
var gTwoPointShot = "TwoPointShot"


function expectimax (node, depth) {

  if (node == null) {
    //initialize
    var root = { kGoodGuy : 0 , kBadGuy : 0 , kPossession: gGoodGuy , kEventType: gDecision}    
    return expectimax(root, 0)
  }
  else if (node.kGoodGuy >= gPlayingUpTo) {
    return gWin    
  }
  else if (node.kBadGuy >= gPlayingUpTo) {
    return gLose    
  }
  else if (depth >= gMaxDepth) {
    return (node.kGoodGuy - node.kBadGuy) //simple point difference heuristic   
  }
  else if ( node.kEventType == gDecision ) {
    var choices = [gTwoPointShot, gThreePointShot]
    var best = node.kPossession == gGoodGuy ? gLose : gWin 
    /* best outcome depends on who has the ball
      if we have it, best is anything better than a loss
      if they have it, best is anything lower than them winning
    */
    for (var i = 0; i < choices.length; i++) {
        var child = clone(node)
        child.kEventType = choices[ i ]
        var childScore = expectimax(child, depth + 1)
        if ( node.kPossession == gGoodGuy && childScore > best )
          // good guy has it - maximize!
          best = childScore
        else if ( node.kPossession == gBadGuy && childScore < best ) 
          // bad guy has it - we want to minimize (as we assume they will make a good move)
          best = childScore
    }
    return best
  }
  else if (node.kEventType == gThreePointShot) {
    var make = clone(node)
    node.kPossession == gGoodGuy ? make.kGoodGuy += 3 : make.kBadGuy += 3 //add 3 to whomever is shooting
    make.kEventType = gDecision //need to decide again what to do w/ next shot

    var miss = clone(node)
    miss.kEventType = gDecision
    miss.kPossession = node.kPossession == gGoodGuy ? gBadGuy : gGoodGuy //swap possession on a miss

    //TODO - vary percentage by player
    return ( gGoodGuyThreePct * expectimax(make, depth + 1) + (1 - gGoodGuyThreePct) * expectimax(miss, depth + 1) )
  }
  else if (node.kEventType == gTwoPointShot) {
    var make = clone(node)
    node.kPossession == gGoodGuy ? make.kGoodGuy += 2 : make.kBadGuy += 2 //add 3 to whomever is shooting
    make.kEventType = gDecision

    var miss = clone(node)
    miss.kEventType = gDecision
    miss.kPossession = node.kPossession == gGoodGuy ? gBadGuy : gGoodGuy //swap possession on a miss

    //TODO - vary percentage by player
    return ( gGoodGuyTwoPct * expectimax(make, depth + 1) + (1 - gGoodGuyTwoPct) * expectimax(miss, depth + 1) )
  }
  else
    alert("shouldn't be here")
}

//utility
function clone (obj) {
  var clone = {}
  for ( var key in obj )
     clone[ key ] = obj[ key ]
  return clone
}
-----------------------------------------------------------------------------------------
--
-- main.lua
--
-----------------------------------------------------------------------------------------

display.setStatusBar( display.DefaultStatusBar )

local widget = require 'widget'
local storyboard = require 'storyboard'


-- event listeners for tab buttons:
local function onLoginView (event)
  storyboard.gotoScene('views.login')
end

onLoginView()

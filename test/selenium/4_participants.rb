require "selenium-webdriver"

@driver = Selenium::WebDriver.for :chrome
@driver.navigate.to "https://localhost:3000/#!/login"
body = @driver.find_element(:tag_name => 'html')
body.send_keys(:control, 'n')
# main_window = @driver.window_handle
# windows = @driver.window_handles
# windows.each do |window|
#   if main_window != window
#     @new_window = window
#   end
# end
# @driver.switch_to.window(@new_window)
# @driver.navigate.to "https://localhost:3000/#!/login"
sleep(1)

# email = @driver.find_element(:xpath, "//input[@id='email']")
# email.send_keys("test1@test.com")
# password = @driver.find_element(:xpath, "//input[@id='password']")
# password.send_keys("toto4242")
sleep(5)
@driver.quit
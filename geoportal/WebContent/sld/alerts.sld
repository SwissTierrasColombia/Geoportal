<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
	xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
    xmlns="http://www.opengis.net/sld" 
    xmlns:ogc="http://www.opengis.net/ogc" 
    xmlns:xlink="http://www.w3.org/1999/xlink" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    
  <NamedLayer>
    <Name>alerts_sld</Name>
    
    <UserStyle>
      <Name>alerts_default</Name>
      <IsDefault>1</IsDefault>
      <FeatureTypeStyle>
        <Rule>
          <Name>STATUS_A</Name>
          <Description>
            <Title>STATUS_A</Title>
          </Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>currentStatusCod</ogc:PropertyName>
              <ogc:Literal>A</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#3BE157</CssParameter>
                  <CssParameter name="fill-opacity">0.6</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#3BE157</CssParameter>
                  <CssParameter name="stroke-width">1</CssParameter>
                  <CssParameter name="stroke-opacity">0.6</CssParameter>
                </Stroke>
              </Mark>
              <Size>15</Size>
            </Graphic>
          </PointSymbolizer>
          
          <LineSymbolizer>
          	<Stroke>
	          	<CssParameter name="stroke">#3BE157</CssParameter>
	          	<CssParameter name="stroke-width">2</CssParameter>
	          	<CssParameter name="stroke-opacity">0.6</CssParameter>
          	</Stroke>
          </LineSymbolizer>
          
          <PolygonSymbolizer>
          	<Fill>
          		<CssParameter name="fill">#3BE157</CssParameter>
          		<CssParameter name="fill-opacity">0.6</CssParameter>
          	</Fill>
          	<Stroke>
	          	<CssParameter name="stroke">#3BE157</CssParameter>
	          	<CssParameter name="stroke-width">1</CssParameter>
	          	<CssParameter name="stroke-opacity">0.6</CssParameter>
          	</Stroke>
          </PolygonSymbolizer>        
        </Rule>
        
        <Rule>
          <Name>STATUS_R</Name>
          <Description>
            <Title>STATUS_R</Title>
          </Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>currentStatusCod</ogc:PropertyName>
              <ogc:Literal>R</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>

          <PointSymbolizer>
             <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#E83A20</CssParameter>
                  <CssParameter name="stroke-width">1</CssParameter>
                  <CssParameter name="fill-opacity">0.6</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#E83A20</CssParameter>
                  <CssParameter name="stroke-opacity">0.6</CssParameter>
                </Stroke>
              </Mark>
              <Size>15</Size>
            </Graphic>
          </PointSymbolizer>
          
          <LineSymbolizer>
          	<Stroke>
	          	<CssParameter name="stroke">#E83A20</CssParameter>
	          	<CssParameter name="stroke-width">2</CssParameter>
	          	<CssParameter name="stroke-opacity">0.6</CssParameter>
          	</Stroke>
          </LineSymbolizer> 
          
          <PolygonSymbolizer>
          	<Fill>
          		<CssParameter name="fill">#E83A20</CssParameter>
          		<CssParameter name="fill-opacity">0.6</CssParameter>
          	</Fill>
          	<Stroke>
	          	<CssParameter name="stroke">#E83A20</CssParameter>
	          	<CssParameter name="stroke-width">1</CssParameter>
	          	<CssParameter name="stroke-opacity">0.6</CssParameter>
          	</Stroke>
          </PolygonSymbolizer>
        </Rule>
        
        <Rule>
          <Name>STATUS_I</Name>
          <Description>
            <Title>STATUS_I</Title>
          </Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>currentStatusCod</ogc:PropertyName>
              <ogc:Literal>I</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>

          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#E1E942</CssParameter>
                  <CssParameter name="fill-opacity">0.6</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#E1E942</CssParameter>
                  <CssParameter name="stroke-width">1</CssParameter>
                  <CssParameter name="stroke-opacity">0.6</CssParameter>
                </Stroke>
              </Mark>
              <Size>15</Size>
            </Graphic>
          </PointSymbolizer>  
          
          <LineSymbolizer>
          	<Stroke>
	          	<CssParameter name="stroke">#E1E942</CssParameter>
	          	<CssParameter name="stroke-width">2</CssParameter>
	          	<CssParameter name="stroke-opacity">0.6</CssParameter>
          	</Stroke>
          </LineSymbolizer> 
                  
          <PolygonSymbolizer>
          	<Fill>
          		<CssParameter name="fill">#E1E942</CssParameter>
          		<CssParameter name="fill-opacity">0.6</CssParameter>
          	</Fill>
          	<Stroke>
	          	<CssParameter name="stroke">#E1E942</CssParameter>
	          	<CssParameter name="stroke-width">1</CssParameter>
	          	<CssParameter name="stroke-opacity">0.6</CssParameter>
          	</Stroke>
          </PolygonSymbolizer>
        </Rule>
        
        <Rule>
          <Name>STATUS_C</Name>
          <Description>
            <Title>STATUS_C</Title>
          </Description>
          <ogc:Filter xmlns:ogc="http://www.opengis.net/ogc">
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>currentStatusCod</ogc:PropertyName>
              <ogc:Literal>C</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#34ADE5</CssParameter>
                  <CssParameter name="fill-opacity">0.6</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#34ADE5</CssParameter>
                  <CssParameter name="stroke-width">1</CssParameter>
                  <CssParameter name="stroke-opacity">0.6</CssParameter>
                </Stroke>
              </Mark>
              <Size>15</Size>
            </Graphic>
          </PointSymbolizer>    
          
          <LineSymbolizer>
          	<Stroke>
	          	<CssParameter name="stroke">#34ADE5</CssParameter>
	          	<CssParameter name="stroke-width">2</CssParameter>
	          	<CssParameter name="stroke-opacity">0.6</CssParameter>
          	</Stroke>
          </LineSymbolizer> 
                 
          <PolygonSymbolizer>
          	<Fill>
          		<CssParameter name="fill">#34ADE5</CssParameter>
          		<CssParameter name="fill-opacity">0.6</CssParameter>
          	</Fill>
          	<Stroke>
	          	<CssParameter name="stroke">#34ADE5</CssParameter>
	          	<CssParameter name="stroke-width">1</CssParameter>
	          	<CssParameter name="stroke-opacity">0.6</CssParameter>
          	</Stroke>
          </PolygonSymbolizer>
        </Rule>
        <Rule>
        	<ElseFilter>
        	</ElseFilter>
	          <PointSymbolizer>
	            <Graphic>
	              <Mark>
	                <WellKnownName>circle</WellKnownName>
	                <Fill>
	                  <CssParameter name="fill">#1403FF</CssParameter>
	                  <CssParameter name="fill-opacity">1</CssParameter>
	                </Fill>
	                <Stroke>
	                  <CssParameter name="stroke">#01000E</CssParameter>
	                  <CssParameter name="stroke-width">1</CssParameter>
	                  <CssParameter name="stroke-opacity">1</CssParameter>
	                </Stroke>
	              </Mark>
	              <Size>15</Size>
	            </Graphic>
	          </PointSymbolizer>
	          
	          <LineSymbolizer>
	          	<Stroke>
		          	<CssParameter name="stroke">#1403FF</CssParameter>
		          	<CssParameter name="stroke-width">1</CssParameter>
		          	<CssParameter name="stroke-opacity">1</CssParameter>
	          	</Stroke>
	          </LineSymbolizer>
	          
	          <PolygonSymbolizer>
	          	<Fill>
	          		<CssParameter name="fill">#1403FF</CssParameter>
	          		<CssParameter name="fill-opacity">1</CssParameter>
	          	</Fill>
	          	<Stroke>
		          	<CssParameter name="stroke">#01000E</CssParameter>
		          	<CssParameter name="stroke-width">1</CssParameter>
		          	<CssParameter name="stroke-opacity">1</CssParameter>
	          	</Stroke>
	          </PolygonSymbolizer>         		
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
    
    <UserStyle>
      <Name>alerts_selected</Name>
      <FeatureTypeStyle>
        <Rule>
          <Name>Default</Name>
          <Description>
            <Title>STATUS_A</Title>
          </Description>
          
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#FF8D00</CssParameter>
                  <CssParameter name="fill-opacity">0.9</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#FF3B21</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                  <CssParameter name="stroke-opacity">0.8</CssParameter>
                </Stroke>
              </Mark>
              <Size>15</Size>
            </Graphic>
          </PointSymbolizer>
          
          <LineSymbolizer>
          	<Stroke>
	          	<CssParameter name="stroke">#FF8D00</CssParameter>
	          	<CssParameter name="stroke-width">3</CssParameter>
	          	<CssParameter name="stroke-opacity">1</CssParameter>
          	</Stroke>
          </LineSymbolizer>
          
          <PolygonSymbolizer>
          	<Fill>
          		<CssParameter name="fill">#FF8D00</CssParameter>
          		<CssParameter name="fill-opacity">1</CssParameter>
          	</Fill>
          	<Stroke>
	          	<CssParameter name="stroke">#FF3B21</CssParameter>
	          	<CssParameter name="stroke-width">2</CssParameter>
	          	<CssParameter name="stroke-opacity">0.8</CssParameter>
          	</Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
    
   	<UserStyle>
      <Name>alerts_hidden</Name>
      <FeatureTypeStyle>
        <Rule>
          <Name>STATUS_A</Name>
          <Description>
            <Title>STATUS_A</Title>
          </Description>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                	<CssParameter name="fill">#000000</CssParameter>
                  	<CssParameter name="fill-opacity">0.0</CssParameter>
                  	<CssParameter name="stroke">#000000</CssParameter>
                 	<CssParameter name="stroke-opacity">0.0</CssParameter>
                </Fill>
              </Mark>
              <Size>15</Size>
            </Graphic>
          </PointSymbolizer>
          
          <LineSymbolizer>
          	<Stroke>
          		<CssParameter name="fill">#000000</CssParameter>
	          	<CssParameter name="fill-opacity">0</CssParameter>
          	</Stroke>
          </LineSymbolizer>
          
          <PolygonSymbolizer>
          	<Fill>
          		<CssParameter name="fill">#000000</CssParameter>
                <CssParameter name="fill-opacity">0.0</CssParameter>
          	</Fill>
          	<Stroke>
	          	<CssParameter name="stroke">#000000</CssParameter>
	          	<CssParameter name="stroke-width">1</CssParameter>
	          	<CssParameter name="stroke-opacity">0.0</CssParameter>
          	</Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
    
  </NamedLayer>
</StyledLayerDescriptor>
